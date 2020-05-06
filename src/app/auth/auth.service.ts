import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthConstants } from "./auth.constants";

const BACKEND_URL = environment.apiUrl + "/auth/";

@Injectable({ providedIn: "root" })
export class AuthService {
  public authStatusListener = new Subject<boolean>();
  private token = "";
  private tokenTimer: any;
  private userId: string;
  private displayName: string;
  private role: string;
  private isAuthenticated = false;

  constructor(private _http: HttpClient, private _router: Router) {}

  signup(user: string, password: string) {
    const authData = { user: user, pwd: password, role: AuthConstants.ROLE_USER };
    this._http.post(BACKEND_URL + "signup", authData).subscribe(
      () => {
        this.login(user, password);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(user: string, password: string) {
    const authData = { user: user, pwd: password };

    this._http
      .post<{ token: string, expiresIn: number, userId: string, name: string, role: string }>(
        BACKEND_URL + "login",
        authData
      )
      .subscribe((reply) => {
        const token = reply.token;
        this.token = token;
        if (token) {
          const expiresInDuration = reply.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = reply.userId;
          this.displayName = reply.name;
          this.role = reply.role;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(token, expirationDate, this.userId, this.displayName, this.role);
          this.routeToLessons();
        }
      }, (error) => {
        this.authStatusListener.next(false);
      });
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.routeToLogin();
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.displayName = authInformation.name;
      this.role = authInformation.role;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isSignUpOn() {
    return environment.signUpOn;
  }

  isDeleteOn(){
    return environment.deleteOn;
  }

  isUpdateOn(){
    return environment.updateOn;
  }

  getIsAuthenticated(){
    return this.isAuthenticated;
  }

  getAuthToken(){
    return this.token;
  }

  getUserId(){
    return this.userId;
  }

  getDisplayName(){
    return this.displayName;
  }

  isAdmin(){
    if(this.role === AuthConstants.ROLE_ADMIN){
      return true;
    }
    return false;
  }

  private setAuthTimer(duration: number) {
    console.log("Setting timer: " + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, displayName: string, role: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("role", role);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("displayName");
    localStorage.removeItem("role");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("displayName");
    const role = localStorage.getItem("role");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      name: name,
      role: role
    };
  }

  private routeToLogin() {
    this._router.navigate(["/auth/login"]);
  }

  private routeToLessons(){
    this._router.navigate(["/lessons/list"]);
  }
}
