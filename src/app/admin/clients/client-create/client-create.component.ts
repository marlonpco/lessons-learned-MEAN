import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Util } from '../../../shared/utilities/utilities';
import { ClientService } from "../clients.service";
import { Client } from "../../../shared/models/admin/clients.model";

@Component({
  templateUrl: './client-create.component.html',
  styleUrls: ['client-create.component.css']
})
export class ClientCreateComponent implements OnInit {

  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;
  public authSubscription: Subscription;

  public form: FormGroup;

  public componentMode: string = Util.MODE_CREATE;
  private clientId: string;

  private client: Client;

  constructor(
    private _clientService: ClientService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute
  ){}

  ngOnInit(){
    this.buildForm();
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.isLoading = true;
        this.componentMode = Util.MODE_EDIT;
        this.clientId = paramMap.get("id");

        this._clientService.getClient(this.clientId).subscribe((data) => {
          this.isLoading = false;

          this.client = {
            id: data._id,
            name: data.name,
            description: data.description
          };

          this.form.setValue({
            name: this.client.name,
            description: this.client.description,
          });
        });
      } else {
        this.componentMode = Util.MODE_CREATE;
        this.clientId = "";

        this.client = {
          id: "",
          name: "",
          description: ""
        }
      }
    });

  }

  onSave(){
    if(this.form.invalid){
      return;
    }

    this.client = {
      id: this.clientId,
      name: this.form.value.name,
      description: this.form.value.description
    }
    if(this.componentMode === Util.MODE_CREATE){
      this._clientService.addClient(this.client);
    }else{
      this._clientService.updateClient(this.client);
    }
  }

  onBack(){
    this._clientService.routeToClientsList();
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
        name: ["", Validators.required],
        description: ["", Validators.required],
      });
  }
}
