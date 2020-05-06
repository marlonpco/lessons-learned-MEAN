import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { LOV } from "../../shared/models/admin/lovs.model";
import { LOVConstant } from "../lovs/lovs.constant";
import { LOVService } from "../lovs/lovs.service";
import { Project } from "../../shared/models/admin/projects.model";
import { ClientService } from "../clients/clients.service";
import { Client } from "../../shared/models/admin/clients.model";

const BACKEND_URL = environment.apiUrl + "/project/";

@Injectable({ providedIn: "root" })
export class ProjectService{
  private projects: Project[];
  private projectsUpdated = new Subject<{projects: Project[], count: number}>();

  constructor(
    private _clientService: ClientService,
    private _lovService: LOVService,
    private _http: HttpClient,
    private _router: Router
  ){}

  add(project: Project){
    this._http
      .post<{ message: string; user: any }>(BACKEND_URL, project)
      .subscribe((reply) => {
        this.routeToProjectsList();
      });
  }

  update(project: Project){
    this._http.put(BACKEND_URL + project.id, project).subscribe(reply => {
      this.routeToProjectsList();
    });
  }

  delete(id: string){
    return this._http.delete(BACKEND_URL + id);
  }

  getLists(itemsPerPage: number, currentPage: number){
    let queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;

    this._http
      .get<{ message: string; projects: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            projects: data.projects.map((project) => {
              return {
                id: project._id,
                name: project.name,
                areaId: project.areaId.description,
                clientId: project.clientId.name,
                phaseId: project.phaseId.description
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.projects = transformedData.projects;
        this.projectsUpdated.next({
          projects: [...this.projects],
          count: transformedData.count,
        });
      });
  }

  getItem(id: string){
    return this._http.get<{
      _id: string,
      name: string,
      areaId: string,
      clientId: string,
      phaseId: string
    }>(BACKEND_URL + id);
  }

  getProjectsUpdatedListener(){
    return this.projectsUpdated.asObservable();
  }

  routeToProjectsList(){
    this._router.navigate(["/admin/projects/list"]);
  }

  loadData(){
    this._http
      .get<{ message: string; projects: any; count: number }>(
        BACKEND_URL
      )
      .pipe(
        map((data) => {
          return {
            projects: data.projects.map((project) => {
              return {
                id: project._id,
                name: project.name,
                areaId: project.areaId.description,
                clientId: project.clientId.name,
                phaseId: project.phaseId.description
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.projects = transformedData.projects;
        this.projectsUpdated.next({
          projects: [...this.projects],
          count: transformedData.count,
        });
      });
  }
}
