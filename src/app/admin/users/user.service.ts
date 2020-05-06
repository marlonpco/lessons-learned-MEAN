import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Users } from "src/app/shared/models/admin/users.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { UserSearch } from "src/app/shared/models/admin/user-search.model";
import { AuthService } from "src/app/auth/auth.service";
import { OPClient } from "../../../js/op_ws_api";
import { Users2 } from "src/app/shared/models/admin/users2.model";

const BACKEND_URL = environment.apiUrl + "/auth/";

@Injectable({ providedIn: "root" })
export class UserService{
  private users: Users[] = [];
  // njbuco change later to users
  private users2: Users2[] = [];
  private usersUpdated = new Subject<{ users: Users[]; count: number }>();

  private preloadedData: Users[] = [];

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _authService: AuthService
  ){}

  // njbuco fetch data from onesait
  getUsers2(client: OPClient): Users2[] {
    let context = this;
    client.query("LL_USER", "db.LL_USER.find()", 'NATIVE').then(response => {
      for (let data of response.body.data) {
        context.users2.push({
          "id": data.LL_USER.SN_ID,
          "username": data.LL_USER.MS_USERNAME,
          "password": data.LL_USER.MS_PASSWORD,
        })
      }
    });
    return this.users2;
  }

  createUser(user: Users, auth: {user: string, password: string, role: string}) {
    const authUser = {
      user: auth.user,
      pwd: auth.password,
      email: user.email,
      empId: user.empId,
      name: user.name,
      role: auth.role
    };

    this._http
      .post<{ message: string; user: any }>(BACKEND_URL, authUser)
      .subscribe((reply) => {
        this.routeToUsersList();
      });
  }

  updateUser(user: Users, role: string){
    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      empId: user.empId,
      role: role
    }
    this._http.put(BACKEND_URL + data.id, data).subscribe(reply => {
      this.routeToUsersList();
    });
  }

  deleteUser(id: string) {
    return this._http.delete(BACKEND_URL + id);
  }

  getUser(id: string){
    return this._http.get<{
      _id: string,
      user: string,
      email: string,
      empId: string,
      name: string,
      role: string
    }>(BACKEND_URL + id);
  }

  getUsers(usersPerPage: number, currentPage: number, filters: UserSearch) {
    let queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
    if(filters.empId !== null){
      queryParams = queryParams + `&empId=${filters.empId}`
    }

    if(filters.email !== null){
      queryParams = queryParams + `&email=${filters.email}`
    }

    if(filters.user !== null){
      queryParams = queryParams + `&user=${filters.user}`
    }

    this._http
      .get<{ message: string; users: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            users: data.users.map((user) => {
              return {
                id: user._id,
                user: user.user,
                email: user.email,
                empId: user.empId,
                name: user.name
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.users = transformedData.users;
        this.usersUpdated.next({
          users: [...this.users],
          count: transformedData.count,
        });
      });
  }

  changePassword(id: string, oldPassword: string, newPassword: string){
    const passwordData = {
      id: id,
      oldPwd: oldPassword,
      newPwd: newPassword
    }
    this._http.put(BACKEND_URL + "change/" + id, passwordData).subscribe(reply => {
      this._authService.logout();
    });
  }

  getUsersUpdateListener(){
    return this.usersUpdated.asObservable();
  }

  routeToUsersList(){
    this._router.navigate(["/admin/users/list"]);
  }

  refreshPreloadedData(){
    this.preloadedData = [];
  }

  loadData(){
    this._http
      .get<{ message: string; users: any; count: number }>(
        BACKEND_URL
      )
      .pipe(
        map((data) => {
          return {
            users: data.users.map((user) => {
              return {
                id: user._id,
                user: user.user,
                email: user.email,
                empId: user.empId,
                name: user.name
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.users = transformedData.users;
        this.usersUpdated.next({
          users: [...this.users],
          count: this.users.length
        });
      });
  }
}
