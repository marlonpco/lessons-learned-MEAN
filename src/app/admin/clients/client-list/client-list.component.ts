import { Component, OnInit, OnDestroy } from "@angular/core"
import { Subscription } from "rxjs";
import { ClientService } from "../clients.service";
import { AuthService } from "src/app/auth/auth.service";
import { Router } from "@angular/router";
import { Client } from "../../../shared/models/admin/clients.model";
import { PageEvent } from "@angular/material";

@Component({
  templateUrl: './client-list.component.html',
  styleUrls: ['client-list.component.css']
})
export class ClientListComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;
  public isAdmin: boolean = false;
  public isDeleteOn: boolean = false;
  public isUpdateOn: boolean = false;

  public displayedColumns: string[] = ['name', 'description', 'id'];
  public dataSource: any;
  private clientsSubscription: Subscription;

  public totalClients: number = 0;
  public clientsPerPage: number = 10;
  public currentPage: number = 1;
  public pageSizeOptions: number[] = [10, 20, 50, 100];

  private authSubscription: Subscription;

  constructor(
    private _clientService: ClientService,
    private _authService: AuthService,
    private _router: Router
  ){}

  ngOnInit(){
    this.isLoading = true;
    this.getClients();
    this.clientsSubscription = this._clientService.getClientsUpdatedListener()
      .subscribe((clientData: {clients: Client[], count: number}) => {
        this.isLoading = false;
        this.dataSource = clientData.clients;
        this.totalClients = clientData.count;
      });

      this.isDeleteOn = this._authService.isDeleteOn();
      this.isUpdateOn = this._authService.isUpdateOn();
      this.isAdmin = this._authService.isAdmin();
      this.isUserAuthenticated = this._authService.getIsAuthenticated();
      this.authSubscription = this._authService.getAuthStatusListener().subscribe(
        isAuthenticated => {
          this.isUserAuthenticated = isAuthenticated;
          this.isAdmin = this._authService.isAdmin();
        }
      );
  }

  ngOnDestroy(){
    this.clientsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onEdit(id: string){
    this._router.navigate(['/admin/clients/edit', id]);
  }

  onDelete(id: string){
    this.isLoading=true;
    this._clientService.deleteClient(id).subscribe(() => {
      this.getClients();
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.clientsPerPage = pageData.pageSize;
    this.getClients();
  }

  private getClients(){
    this._clientService.getClients(this.clientsPerPage, this.currentPage);
  }
}
