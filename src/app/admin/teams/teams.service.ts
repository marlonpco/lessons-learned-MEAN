import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";


import { Teams } from "../../shared/models/admin/teams.model";
import { Project } from "../../shared/models/admin/projects.model";
import { UserService } from "../users/user.service";
import { ProjectService } from "../projects/projects.service";

const BACKEND_URL = environment.apiUrl + "/team/";

@Injectable({ providedIn: "root" })
export class TeamService{
  private teams: Teams[];
  private teamsUpdated = new Subject<{teams: Teams[], count: number}>();
  private teamsDropDownUpdated = new Subject<{projects: Project[], count: number}>();

  constructor(
    private _projectService: ProjectService,
    private _userService: UserService,
    private _http: HttpClient,
    private _router: Router
  ){}

  add(teams: Teams){
    this._http
      .post<{ message: string; user: any }>(BACKEND_URL, teams)
      .subscribe((reply) => {
        this.routeToTeamsList();
      });
  }

  update(teams: Teams){
    this._http.put(BACKEND_URL + teams.id, teams).subscribe(reply => {
      this.routeToTeamsList();
    });
  }

  delete(id: string){
    return this._http.delete(BACKEND_URL + id);
  }

  getLists(itemsPerPage: number, currentPage: number){
    let queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;

    this._http
      .get<{ message: string; teams: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            teams: data.teams.map((teams) => {
              return {
                id: teams._id,
                project: teams.project.name,
                user: teams.user.name
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.teams = transformedData.teams;
        this.teamsUpdated.next({
          teams: [...this.teams],
          count: transformedData.count,
        });
      });
  }

  getItem(id: string){
    return this._http.get<{
      _id: string,
      project: string,
      user: string
    }>(BACKEND_URL + id);
  }

  getTeamsUpdatedListener(){
    return this.teamsUpdated.asObservable();
  }

  getTeamsDropDownUpdatedListener(){
    return this.teamsDropDownUpdated.asObservable();
  }

  routeToTeamsList(){
    this._router.navigate(["/admin/teams/list"]);
  }

  loadData(userId?: string){
    let queryParams ="";

    if(userId){
      queryParams += `?user=${userId}`;
    }
    this._http
      .get<{ message: string; teams: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            projects: data.teams.map((team) => {
              return {
                id: team.project._id,
                name: team.project.name,
                areaId: team.project.areaId,
                clientId: team.project.clientId,
                phaseId: team.project.phaseId
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.teamsDropDownUpdated.next({
          projects: transformedData.projects,
          count: transformedData.count
        });
      });
  }
}
