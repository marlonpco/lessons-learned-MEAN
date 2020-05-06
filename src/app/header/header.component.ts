import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  public isUserAuthenticated: boolean = false;
  public userDisplayName: string = "";

  private authListenerSubscription: Subscription;

  public isAdmin: boolean = false;

  constructor(
    private _authService: AuthService
  ){}

  ngOnInit(){
    this.isAdmin = this._authService.isAdmin();
    this.isUserAuthenticated = this._authService.getIsAuthenticated();
    this.userDisplayName = this._authService.getDisplayName();
    this.authListenerSubscription = this._authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.userDisplayName = this._authService.getDisplayName();
        this.isAdmin = this._authService.isAdmin();
      }
    );
  }

  ngOnDestroy(){
    this.authListenerSubscription.unsubscribe();
  }

  onLogout(){
    this._authService.logout();
  }
}
