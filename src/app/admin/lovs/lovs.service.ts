import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { LOV } from "../../shared/models/admin/lovs.model";
import { LOVConstant } from "./lovs.constant";

const BACKEND_URL = environment.apiUrl + "/lov/";

@Injectable({ providedIn: "root" })
export class LOVService{
  private lovs: LOV[];
  private lovsUpdated = new Subject<{lovs: LOV[], count: number}>();
  private areasUpdated = new Subject<{areas: LOV[]}>();
  private phasesUpdated = new Subject<{phases: LOV[]}>();
  private technologiessUpdated = new Subject<{technologies: LOV[]}>();
  private typesUpdated = new Subject<{types: LOV[]}>();
  private classificationsUpdated = new Subject<{classifications: LOV[]}>();
  private severitiesUpdated = new Subject<{severities: LOV[]}>();

  private areas: LOV[] = [];
  private phases: LOV[]  = [];
  private technologies: LOV[]  = [];
  private types: LOV[]  = [];
  private classifications: LOV[]  = [];
  private severities: LOV[]  = [];

  constructor(
    private _http: HttpClient,
    private _router: Router
  ){}

  add(lov: LOV){
    this._http
      .post<{ message: string; user: any }>(BACKEND_URL, lov)
      .subscribe((reply) => {
        this.routeToLOVsList();
      });
  }

  update(lov: LOV){
    this._http.put(BACKEND_URL + lov.id, lov).subscribe(reply => {
      this.routeToLOVsList();
    });
  }

  delete(id: string){
    return this._http.delete(BACKEND_URL + id);
  }

  getLists(itemsPerPage: number, currentPage: number, code: string){
    let queryParams = `?pagesize=${itemsPerPage}&page=${currentPage}`;

    if(code){
      queryParams = queryParams + `&code=${code}`;
    }

    this._http
      .get<{ message: string; lovs: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            lovs: data.lovs.map((lov) => {
              return {
                id: lov._id,
                code: lov.code,
                description: lov.description
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.lovs = transformedData.lovs;
        this.lovsUpdated.next({
          lovs: [...this.lovs],
          count: transformedData.count,
        });
      });
  }

  loadDataByCode(code: string){
    const queryParams = `?code=${code}`;

    this._http
      .get<{ message: string; lovs: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            lovs: data.lovs.map((lov) => {
              return {
                id: lov._id,
                code: lov.code,
                description: lov.description
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        if(LOVConstant.AREA === code){
          this.areas = transformedData.lovs;
          this.areasUpdated.next({
            areas: [...this.areas]
          });
        }

        if(LOVConstant.PROJECTPHASE === code){
          this.phases = transformedData.lovs;
          this.phasesUpdated.next({
            phases: [...this.phases]
          });
        }

        if(LOVConstant.TECHNOLOGY === code){
          this.technologies = transformedData.lovs;
          this.technologiessUpdated.next({
            technologies: [...this.technologies]
          });
        }

        if(LOVConstant.TYPE === code){
          this.types = transformedData.lovs;
          this.typesUpdated.next({
            types: [...this.types]
          });
        }

        if(LOVConstant.CLASSIFICATION === code){
          this.classifications = transformedData.lovs;
          this.classificationsUpdated.next({
            classifications: [...this.classifications]
          });
        }

        if(LOVConstant.SEVERITY === code){
          this.severities = transformedData.lovs;
          this.severitiesUpdated.next({
            severities: [...this.severities]
          });
        }
      });
  }

  getItem(id: string){
    return this._http.get<{
      _id: string,
      code: string,
      description: string
    }>(BACKEND_URL + id);
  }

  getLOVsUpdatedListener(){
    return this.lovsUpdated.asObservable();
  }

  getAreasUpdatedListener(){
    return this.areasUpdated.asObservable();
  }

  getPhasesUpdatedListener(){
    return this.phasesUpdated.asObservable();
  }

  getTechnologiesUpdatedListener(){
    return this.technologiessUpdated.asObservable();
  }

  getTypesUpdatedListener(){
    return this.typesUpdated.asObservable();
  }

  getClassificationsUpdatedListener(){
    return this.classificationsUpdated.asObservable();
  }

  getSeveritiesUpdatedListener(){
    return this.severitiesUpdated.asObservable();
  }

  routeToLOVsList(){
    this._router.navigate(["/admin/lovs/list"]);
  }
}
