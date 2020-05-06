import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { UserService } from "../user.service";
import { MustMatch } from "src/app/shared/validators/must-match.validator";
import { Util } from '../../../shared/utilities/utilities';
import { Users } from "../../../shared/models/admin/users.model";
import { AuthService } from "../../../auth/auth.service";
import { AuthConstants } from "../../../auth/auth.constants";

@Component({
  templateUrl: './user-create.component.html',
  styleUrls: ['user-create.component.css']
})
export class UserCreateComponent implements OnInit {

  public isLoading: boolean = false;
  public isAdmin: boolean = false;

  public form: FormGroup;
  public hidePassword: boolean = true;
  public hideConfirm: boolean = true;

  public componentMode: string = Util.MODE_CREATE;
  private userId: string;

  private userData: Users;
  private authData: {user: string, password: string, role: string};
  private authUser: {
    user: Users,
    auth: {
      user: string,
      password: string,
      role: string
    }
  }

  public roles = [];

  constructor(
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _authService: AuthService
  ){}

  ngOnInit(){
    this.buildForm();
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.isLoading = true;
        this.componentMode = Util.MODE_EDIT;
        this.userId = paramMap.get("id");

        this._userService.getUser(this.userId).subscribe((data) => {
          this.isLoading = false;

          this.userData = {
            id: data._id,
            empId: (data.empId) ? data.empId : "",
            email: (data.email) ? data.email : "",
            name: (data.name) ? data.name: ""
          }

          this.authData = {
            user: data.user,
            password: "",
            role: data.role
          }

          this.authUser = {
            user: this.userData,
            auth: this.authData
          }

          this.form.setValue({
            user: this.authData.user,
            email: this.userData.email,
            empId: this.userData.empId,
            name: this.userData.name,
            password: "",
            confirm: "",
            role: this.authData.role
          });

          this.form.get('password').clearValidators();
          this.form.get('confirm').clearValidators();
          this.form.get('user').disable();
          this.form.updateValueAndValidity();
        });
      } else {
        this.componentMode = Util.MODE_CREATE;
        this.userId = "";

        this.userData = { id: this.userId, name: "", email: "", empId: ""};
        this.authData = { user: "", password: "", role: AuthConstants.ROLE_USER};
        this.authUser = {
          user: this.userData,
          auth: this.authData
        }
      }
    });

    this.roles = AuthConstants.ROLES;
    this.isAdmin = this._authService.isAdmin();
    if(!this.isAdmin){
      this.form.get('role').setValue(AuthConstants.ROLE_USER);
      this.form.get('role').disable();
      this.form.updateValueAndValidity();
    }
  }

  onSave(){
    if(this.form.invalid){
      return;
    }

    if(this.componentMode === Util.MODE_CREATE){
      this.userData = {
        id: null,
        empId: this.form.value.empId,
        email: this.form.value.email,
        name: this.form.value.name
      }

      this.authData = {
        user: this.form.value.user,
        password: this.form.value.password,
        role: this.form.value.role
      }

      this.authUser = {
        user: this.userData,
        auth: this.authData
      }

      this._userService.createUser(this.authUser.user, this.authUser.auth);
    }else{
      this.userData= {
        empId: this.form.value.empId,
        email: this.form.value.email,
        name: this.form.value.name,
        id: this.authUser.user.id
      };

      this.authUser.user = this.userData;
      this._userService.updateUser(this.authUser.user, this.form.value.role);
    }
  }

  onBack(){
    this._userService.routeToUsersList();
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  emailOnly(event): boolean{
    const charCode = (event.which) ? event.which : event.keyCode;
    if((charCode >= 97 && charCode <= 122) || // a-z
        (charCode >= 65 && charCode <= 90) || // A-Z
        (charCode >= 48 && charCode <= 57) || // 0-9
        charCode === 64 || // @
        charCode === 46){ // .
          return true;
        }

    return false;
  }

  getModeCreate(){
    return Util.MODE_CREATE;
  }

  private buildForm(){
      this.form = this._formBuilder.group({
        user: ["", Validators.required],
        password: ["", [Validators.required, Validators.minLength(6)]],
        email: ["", [Validators.required, Validators.email]],
        empId: ["", [Validators.required, Validators.minLength(6)]],
        name: ["", null],
        confirm: ["", Validators.required],
        role: ["", Validators.required]
      }, {
        validators: MustMatch('password', 'confirm')
      });
  }
}
