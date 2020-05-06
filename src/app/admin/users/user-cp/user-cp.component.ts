import { Component, OnInit } from "@angular/core";
import { UserService } from "../user.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Util } from '../../../shared/utilities/utilities'
import { AuthService } from "../../../auth/auth.service";
import { MustMatch } from "../../../shared/validators/must-match.validator";

@Component({
  templateUrl: './user-cp.component.html',
  styleUrls: ['./user-cp.component.css']
})
export class UserChangePasswordComponent implements OnInit{

  public isLoading: boolean = false;
  public hidePassword: boolean = true;

  public form: FormGroup;

  public componentMode: string = Util.MODE_EDIT;

  public userId: string;

  constructor(
    private _userService: UserService,
    private _authService: AuthService,
    private _formBuilder: FormBuilder
  ){}

  ngOnInit(){
    this.buildForm();

    this.userId = this._authService.getUserId();
  }

  onChangePassword(){
    if(this.form.invalid){
      return;
    }

    let userId = this._authService.getUserId();
    let oldPwd = this.form.value.oldPassword;
    let newPwd = this.form.value.password;
    this._userService.changePassword(userId, oldPwd, newPwd);
  }

  onBack(){
    this._userService.routeToUsersList();
  }

  getModeCreate(){
    return Util.MODE_CREATE;
  }

  private buildForm(){
    this.form = this._formBuilder.group({
      oldPassword: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirm: ["", Validators.required]
    }, {
      validators: MustMatch('password', 'confirm')
    });
}
}
