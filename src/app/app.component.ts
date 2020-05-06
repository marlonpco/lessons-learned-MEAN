import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'lessons-learnedv2';

  constructor(
    private _authService: AuthService
  ){}

  ngOnInit(){
    this._authService.autoAuthUser();
  }
}
