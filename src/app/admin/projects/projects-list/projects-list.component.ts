import { Component, OnInit, OnDestroy } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material";
import { ProjectService } from "../projects.service";
import { Project } from "../../../shared/models/admin/projects.model";
import { LOV } from "../../../shared/models/admin/lovs.model";
import { Client } from "../../../shared/models/admin/clients.model";
import { LOVService } from "../../lovs/lovs.service";
import { ClientService } from "../../clients/clients.service";
import { LOVConstant } from "../../lovs/lovs.constant";

@Component({
  templateUrl: './projects-list.component.html',
  styleUrls: ['projects-list.component.css']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;

  public displayedColumns: string[] = ['name', 'clientId', 'phaseId', 'areaId', 'id'];
  public dataSource: any;
  private projectsSubscription: Subscription;

  public totalItems: number = 0;
  public itemsPerPage: number = 10;
  public currentPage: number = 1;
  public pageSizeOptions: number[] = [10, 20, 50, 100];

  private authSubscription: Subscription;

  public isAdmin:boolean = false;
  public isLOVDeleteOn:boolean = false;
  public isLOVUpdateOn:boolean = false;

  constructor(
    private _projectService: ProjectService,
    private _clientService: ClientService,
    private _lovService: LOVService,
    private _authService: AuthService,
    private _router: Router
  ){}

  ngOnInit(){
    this.isLoading = true;
    this.getLists();
    this.projectsSubscription = this._projectService.getProjectsUpdatedListener()
    .subscribe((data: {projects: Project[], count: number}) => {
      this.isLoading = false;
      this.dataSource = data.projects;
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
    this.projectsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onEdit(id: string){
    this._router.navigate(['/admin/projects/edit', id]);
  }

  onDelete(id: string){
    this.isLoading=true;
    this._projectService.delete(id).subscribe(() => {
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
    this._projectService.getLists(this.itemsPerPage, this.currentPage);
  }
}
