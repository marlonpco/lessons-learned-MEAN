import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ParamMap, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { Util } from '../../../shared/utilities/utilities';
import { Project } from "../../../shared/models/admin/projects.model";
import { Client } from "../../../shared/models/admin/clients.model";
import { LOVConstant } from "../../lovs/lovs.constant";
import { TeamService } from "../teams.service";
import { ProjectService } from "../../projects/projects.service";
import { UserService } from "../../users/user.service";
import { Users } from "../../../shared/models/admin/users.model";
import { Teams } from "../../../shared/models/admin/teams.model";

@Component({
  templateUrl: './teams-create.component.html',
  styleUrls: ['teams-create.component.css']
})
export class TeamCreateComponent implements OnInit, OnDestroy {

  public isLoading: boolean = false;
  public isUserAuthenticated: boolean = false;
  public authSubscription: Subscription;

  public form: FormGroup;

  public componentMode: string = Util.MODE_CREATE;
  private teamId: string;

  private team: Teams;

  public projects: Project[];
  public users: Users[];

  private projectSubscription: Subscription;
  private userSubscription: Subscription;

  constructor(
    private _projectService: ProjectService,
    private _teamService: TeamService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute
  ){}

  ngOnDestroy(){
    this.projectSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  ngOnInit(){
    this.isLoading = true;
    this.buildForm();
    this.intializeDropdownList();
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.componentMode = Util.MODE_EDIT;
        this.teamId = paramMap.get("id");

        this._teamService.getItem(this.teamId).subscribe((data) => {
          this.isLoading = false;

          this.team = {
            id: data._id,
            project: data.project,
            user: data.user
          };

          this.form.setValue({
            project: this.team.project,
            user: this.team.user
          });
        });
      } else {
        this.componentMode = Util.MODE_CREATE;
        this.teamId = "";

        this.team = {
          id: "",
          project: "",
          user: ""
        }
        this.isLoading = false;
      }
    });

  }

  onSave(){
    if(this.form.invalid){
      return;
    }

    this.team = {
      id: this.teamId,
      project: this.form.value.project,
      user: this.form.value.user
    }
    if(this.componentMode === Util.MODE_CREATE){
      this._teamService.add(this.team);
    }else{
      this._teamService.update(this.team);
    }
  }

  onBack(){
    this._teamService.routeToTeamsList();
  }

  getModeCreate(){
    return Util.MODE_CREATE;
  }

  private buildForm(){
      this.form = this._formBuilder.group({
        project: ["", Validators.required],
        user: ["", Validators.required]
      });
  }

  private intializeDropdownList(){
    this._projectService.loadData();
    this.projectSubscription = this._projectService.getProjectsUpdatedListener()
    .subscribe((data: {projects: Project[], count: number}) => {
      this.projects = data.projects;
    });

    this._userService.loadData();
    this.userSubscription = this._userService.getUsersUpdateListener()
    .subscribe((data) => {
      this.users = data.users
    });
  }
}
