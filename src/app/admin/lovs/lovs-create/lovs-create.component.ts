import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Util } from '../../../shared/utilities/utilities';
import { LOVService } from "../lovs.service";
import { LOV } from "../../../shared/models/admin/lovs.model";
import { LOVConstant } from "../lovs.constant";

@Component({
  templateUrl: './lovs-create.component.html',
  styleUrls: ['lovs-create.component.css']
})
export class LOVCreateComponent implements OnInit {

  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;
  public authSubscription: Subscription;

  public form: FormGroup;

  public componentMode: string = Util.MODE_CREATE;
  private lovId: string;

  private lov: LOV;

  public lovManager = [];

  constructor(
    private _lovService: LOVService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute
  ){}

  ngOnInit(){
    this.lovManager = LOVConstant.keyValue;
    this.buildForm();
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.isLoading = true;
        this.componentMode = Util.MODE_EDIT;
        this.lovId = paramMap.get("id");

        this._lovService.getItem(this.lovId).subscribe((data) => {
          this.isLoading = false;

          this.lov = {
            id: data._id,
            code: data.code,
            description: data.description
          };

          this.form.setValue({
            code: this.lov.code,
            description: this.lov.description,
          });
        });
      } else {
        this.componentMode = Util.MODE_CREATE;
        this.lovId = "";

        this.lov = {
          id: "",
          code: "",
          description: ""
        }
      }
    });

  }

  onSave(){
    if(this.form.invalid){
      return;
    }

    this.lov = {
      id: this.lovId,
      code: this.form.value.code,
      description: this.form.value.description
    }
    if(this.componentMode === Util.MODE_CREATE){
      this._lovService.add(this.lov);
    }else{
      this._lovService.update(this.lov);
    }
  }

  onBack(){
    this._lovService.routeToLOVsList();
  }

  getModeCreate(){
    return Util.MODE_CREATE;
  }

  private buildForm(){
      this.form = this._formBuilder.group({
        code: ["", Validators.required],
        description: ["", Validators.required],
      });
  }
}
