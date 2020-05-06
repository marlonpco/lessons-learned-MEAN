import { Component, OnInit, OnDestroy } from "@angular/core"
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material";
import { LOVService } from "../lovs.service";
import { LOV } from "../../../shared/models/admin/lovs.model";
import { LOVConstant } from "../lovs.constant";

@Component({
  templateUrl: './lovs-list.component.html',
  styleUrls: ['lovs-list.component.css']
})
export class LOVListComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;

  public displayedColumns: string[] = ['code', 'description', 'id'];
  public dataSource: any;
  private lovsSubscription: Subscription;

  public totalItems: number = 0;
  public itemsPerPage: number = 10;
  public currentPage: number = 1;
  public pageSizeOptions: number[] = [10, 20, 50, 100];

  private authSubscription: Subscription;

  public lovManager = [];
  public activeCode: string;

  public isAdmin:boolean = false;
  public isLOVDeleteOn:boolean = false;
  public isLOVUpdateOn:boolean = false;

  constructor(
    private _lovService: LOVService,
    private _authService: AuthService,
    private _router: Router
  ){}

  ngOnInit(){
    this.isLoading = true;
    this.lovManager = LOVConstant.keyValue;
    this.activeCode = ""; //assign a key if you want a preselected value e.g. lovManager[0].key for "AREA"
    this.getLists();
    this.lovsSubscription = this._lovService.getLOVsUpdatedListener()
      .subscribe((lovData: {lovs: LOV[], count: number}) => {
        this.isLoading = false;
        this.dataSource = lovData.lovs;
        this.totalItems = lovData.count;
      });

      this.isAdmin = this._authService.isAdmin();
      this.isLOVDeleteOn = this._authService.isDeleteOn();
      this.isLOVUpdateOn = this._authService.isUpdateOn();
      this.isUserAuthenticated = this._authService.getIsAuthenticated();
      this.authSubscription = this._authService.getAuthStatusListener().subscribe(
        isAuthenticated => {
          this.isUserAuthenticated = isAuthenticated;
          this.isAdmin = this._authService.isAdmin();
        }
      );
  }

  ngOnDestroy(){
    this.lovsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onEdit(id: string){
    this._router.navigate(['/admin/lovs/edit', id]);
  }

  onDelete(id: string){
    this.isLoading=true;
    this._lovService.delete(id).subscribe(() => {
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

  onTypeChange(){
    this.getLists();
  }

  private getLists(){
    this._lovService.getLists(this.itemsPerPage, this.currentPage, this.activeCode);
  }
}
