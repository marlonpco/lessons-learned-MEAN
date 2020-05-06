import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Util } from '../../../shared/utilities/utilities';
import { ProjectService } from "../projects.service";
import { Project } from "../../../shared/models/admin/projects.model";
import { LOV } from "../../../shared/models/admin/lovs.model";
import { Client } from "../../../shared/models/admin/clients.model";
import { ClientService } from "../../clients/clients.service";
import { LOVService } from "../../lovs/lovs.service";
import { LOVConstant } from "../../lovs/lovs.constant";

@Component({
  templateUrl: './projects-create.component.html',
  styleUrls: ['projects-create.component.css']
})
export class ProjectCreateComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;
  public authSubscription: Subscription;

  public form: FormGroup;

  public componentMode: string = Util.MODE_CREATE;
  private projectId: string;

  private project: Project;

  public areas: LOV[];
  public phases: LOV[];
  public clients: Client[];

  private clientSubscription: Subscription;
  private areasSubscription: Subscription;
  private phasesSubscription: Subscription;

  constructor(
    private _projectService: ProjectService,
    private _clientService: ClientService,
    private _lovService: LOVService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute
  ){}

  ngOnDestroy(){
    this.clientSubscription.unsubscribe();
    this.areasSubscription.unsubscribe();
    this.phasesSubscription.unsubscribe();
  }

  ngOnInit(){
    this.isLoading = true;
    this.buildForm();
    this.intializeDropdownList();
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.componentMode = Util.MODE_EDIT;
        this.projectId = paramMap.get("id");

        this._projectService.getItem(this.projectId).subscribe((data) => {
          this.isLoading = false;

          this.project = {
            id: data._id,
            name: data.name,
            areaId: data.areaId,
            clientId: data.clientId,
            phaseId: data.phaseId
          };

          this.form.setValue({
            name: this.project.name,
            areaId: this.project.areaId,
            clientId: this.project.clientId,
            phaseId: this.project.phaseId,
          });
        });
      } else {
        this.componentMode = Util.MODE_CREATE;
        this.projectId = "";

        this.project = {
          id: "",
          name: "",
          areaId: "",
          clientId: "",
          phaseId: ""
        }
        this.isLoading = false;
      }
    });

  }

  onSave(){
    if(this.form.invalid){
      return;
    }

    this.project = {
      id: this.projectId,
      name: this.form.value.name,
      areaId: this.form.value.areaId,
      clientId: this.form.value.clientId,
      phaseId: this.form.value.phaseId
    }
    if(this.componentMode === Util.MODE_CREATE){
      this._projectService.add(this.project);
    }else{
      this._projectService.update(this.project);
    }
  }

  onBack(){
    this._projectService.routeToProjectsList();
  }

  getModeCreate(){
    return Util.MODE_CREATE;
  }

  private buildForm(){
      this.form = this._formBuilder.group({
        name: ["", Validators.required],
        areaId: ["", Validators.required],
        clientId: ["", Validators.required],
        phaseId: ["", Validators.required],
      });
  }

  private intializeDropdownList(){
    this._clientService.loadData();
    this.clientSubscription = this._clientService.getClientsUpdatedListener()
    .subscribe((data) => {
      this.clients = data.clients;
    });

    this._lovService.loadDataByCode(LOVConstant.AREA);
    this.areasSubscription = this._lovService.getAreasUpdatedListener()
    .subscribe((data) => {
      this.areas = data.areas
    });

    this._lovService.loadDataByCode(LOVConstant.PROJECTPHASE);
    this.phasesSubscription = this._lovService.getPhasesUpdatedListener()
    .subscribe((data) => {
      this.phases = data.phases
    });
  }
}
