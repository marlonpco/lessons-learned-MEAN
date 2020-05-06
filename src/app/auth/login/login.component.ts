import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  public isLoading: boolean = false;
  public form: FormGroup;
  public isSignUpOn = false;
  private authStatusSub: Subscription;

  public hidePassword: boolean = true;

  constructor(
    private _fb: FormBuilder,
    private _authService: AuthService
  ){}

  ngOnInit(){
    this.form = this._fb.group({
      user: ["", Validators.required],
      pwd: ["", Validators.required],
      signup: [false, null]
    });

    this.isSignUpOn = this._authService.isSignUpOn();
    this.authStatusSub = this._authService.getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  onLogin(){
    if(this.form.invalid){
      return;
    }

    this.isLoading = true;

    const isSignUp = this.form.value.signup;

    if(isSignUp){
      this._authService.signup(this.form.value.user, this.form.value.pwd);
    }else{
      this._authService.login(this.form.value.user, this.form.value.pwd);
    }
  }


}
