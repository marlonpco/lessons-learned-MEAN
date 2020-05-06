import { Component, OnInit, OnDestroy } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material";

import { TeamService } from "../teams.service";
import { Teams } from "../../../shared/models/admin/teams.model";

@Component({
  templateUrl: './teams-list.component.html',
  styleUrls: ['teams-list.component.css']
})
export class TeamListComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;

  public displayedColumns: string[] = ['project', 'user', 'id'];
  public dataSource: any;
  private teamsSubscription: Subscription;

  public totalItems: number = 0;
  public itemsPerPage: number = 10;
  public currentPage: number = 1;
  public pageSizeOptions: number[] = [10, 20, 50, 100];

  private authSubscription: Subscription;

  public isAdmin:boolean = false;
  public isLOVDeleteOn:boolean = false;
  public isLOVUpdateOn:boolean = false;

  constructor(
    private _teamsService: TeamService,
    private _authService: AuthService,
    private _router: Router
  ){}

  ngOnInit(){
    this.isLoading = true;
    this.getLists();
    this.teamsSubscription = this._teamsService.getTeamsUpdatedListener()
    .subscribe((data: {teams: Teams[], count: number}) => {
      this.isLoading = false;
      this.dataSource = data.teams;
      this.totalItems = data.count;
    });

    this.isAdmin = this._authService.isAdmin();
    this.isLOVDeleteOn = this._authService.isDeleteOn();
    this.isLOVUpdateOn = this._authService.isUpdateOn();
    this.isUserAuthenticated = this._authService.getIsAuthenticated();
    this.authSubscription = this._authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.isAdmin = this._authService.isAdmin();
      }
    );
  }

  ngOnDestroy(){
    this.teamsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onEdit(id: string){
    this._router.navigate(['/admin/teams/edit', id]);
  }

  onDelete(id: string){
    this.isLoading=true;
    this._teamsService.delete(id).subscribe(() => {
      this.getLists();
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.itemsPerPage = pageData.pageSize;
    this.getLists();
  }

  private getLists(){
    this._teamsService.getLists(this.itemsPerPage, this.currentPage);
  }
}
