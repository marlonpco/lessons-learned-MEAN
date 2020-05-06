import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Client } from "../../shared/models/admin/clients.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";

const BACKEND_URL = environment.apiUrl + "/client/";

@Injectable({ providedIn: "root" })
export class ClientService{
  private clients: Client[];
  private clientsUpdated = new Subject<{clients: Client[], count: number}>();

  private preloadedData: Client[] = [];

  constructor(
    private _http: HttpClient,
    private _router: Router
  ){}

  addClient(client: Client){
    this._http
      .post<{ message: string; user: any }>(BACKEND_URL, client)
      .subscribe((reply) => {
        this.routeToClientsList();
      });
  }

  updateClient(client: Client){
    this._http.put(BACKEND_URL + client.id, client).subscribe(reply => {
      this.routeToClientsList();
    });
  }

  deleteClient(id: string){
    return this._http.delete(BACKEND_URL + id);
  }

  getClients(clientsPerPage: number, currentPage: number){
    const queryParams = `?pagesize=${clientsPerPage}&page=${currentPage}`;

    this._http
      .get<{ message: string; clients: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            clients: data.clients.map((client) => {
              return {
                id: client._id,
                name: client.name,
                description: client.description
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.clients = transformedData.clients;
        this.clientsUpdated.next({
          clients: [...this.clients],
          count: transformedData.count,
        });
      });
  }

  getClient(id: string){
    return this._http.get<{
      _id: string,
      name: string,
      description: string
    }>(BACKEND_URL + id);
  }

  getClientsUpdatedListener(){
    return this.clientsUpdated.asObservable();
  }

  routeToClientsList(){
    this._router.navigate(["/admin/clients/list"]);
  }

  loadData(){
    this._http
    .get<{ message: string; clients: any; count: number }>(
      BACKEND_URL
    )
    .pipe(
      map((data) => {
        return {
          clients: data.clients.map((client) => {
            return {
              id: client._id,
              name: client.name,
              description: client.description
            };
          }),
          count: data.count,
        };
      })
    )
    .subscribe((transformedData) => {
      this.preloadedData = transformedData.clients;
      this.clientsUpdated.next({
        clients: [...this.preloadedData],
        count: transformedData.count,
      });
    });
  }

}
