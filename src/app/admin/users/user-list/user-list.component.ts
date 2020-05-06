import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { UserSearch } from "../../../shared/models/admin/user-search.model";
import { Util } from "../../../shared/utilities/utilities";
import { UserService } from "../user.service";
import { Users } from "../../../shared/models/admin/users.model";
import { AuthService } from "../../../auth/auth.service";
// application of onesait
import { OPClient } from "../../../../js/op_ws_api";
import { Users2 } from "src/app/shared/models/admin/users2.model";

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;
  public isAdmin: boolean = false;
  public isDeleteOn: boolean = false;
  public isUpdateOn: boolean = false;

  public displayedColumns: string[] = ['empId', 'user', 'name', 'email', 'id'];
  public dataSource: any;
  private userSubscription: Subscription;

  public totalUsers: number = 0;
  public usersPerPage: number = 10;
  public currentPage: number = 1;
  public pageSizeOptions: number[] = [10, 20, 50, 100];

  private authSubscription: Subscription;

  public form: FormGroup;
  private filters: UserSearch;

  // Onesait connection config and client initialization
  private config = {"url":"https://lab.onesaitplatform.com/iot-broker/message", "token":"457ee933040441b5ac5198e17796594a", "deviceTemplate": "Lessons Learned PH", "device":"Web2"}; //Ontology: AirQuality
  private client: OPClient = new OPClient();

  // Change later to Users
  private users2: Users2[];

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ){}

  ngOnInit(){
    this.isLoading = true;
    this.initializeFilter();
    this.buildForm();
    this.getUsers();
    this.userSubscription = this._userService.getUsersUpdateListener()
      .subscribe((userData: {users: Users[], count: number}) => {
        this.isLoading = false;
        this.dataSource = userData.users;
        this.totalUsers = userData.count;
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
    
    // Connection to Onesait
    this.client.configure(this.config);
    this.client.connect();

    this.client.join().then(response => {
      console.log("par -> " + JSON.stringify(response));
    })
  }

  // Data from onesait
  getUsers2() {
    this.users2 = this._userService.getUsers2(this.client);
    console.log(this.users2);
  }

  ngOnDestroy(){
    this.initializeFilter();
    this.userSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onEdit(id: string){
    this._router.navigate(['/admin/users/edit', id]);
  }

  onDelete(id: string){
    this.isLoading=true;
    this._userService.deleteUser(id).subscribe(() => {
      this.getUsers();
    }, () => {
      this.isLoading = false;
    });
  }

  onChangedPage(pageData: PageEvent){
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.usersPerPage = pageData.pageSize;
    this.getUsers();
  }

  onSearch(){
    if(this.form.value.empId !== null && this.form.value.empId !== ''){
      this.filters.empId = Util.convertToBackendString(this.form.value.empId);
    }

    if(this.form.value.email !== null && this.form.value.email !== ''){
      this.filters.email = Util.convertToBackendString(this.form.value.email);
    }

    if(this.form.value.user !== null && this.form.value.user !== ''){
      this.filters.user = Util.convertToBackendString(this.form.value.user);
    }

    this.getUsers();
  }

  onClear(){
    this.initializeFilter();
    this.form.reset();
    this.getUsers();
  }

  private getUsers(){
    this._userService.getUsers(this.usersPerPage, this.currentPage, this.filters);
  }

  private buildForm(){
    this.form = this._formBuilder.group({
      empId: ["", null],
      user: ["", null],
      email: ["", null]
    });
  }

  private initializeFilter(){
    this.filters = {
      empId: null,
      email: null,
      user: null
    }
  }
}
