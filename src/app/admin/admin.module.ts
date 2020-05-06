import { NgModule } from "@angular/core";

import { MaterialModule } from "../material.module";
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { UserCreateComponent } from "./users/user-create/user-create.component";
import { UserListComponent } from "./users/user-list/user-list.component";
import { UserChangePasswordComponent } from "./users/user-cp/user-cp.component";
import { ClientListComponent } from "./clients/client-list/client-list.component";
import { ClientCreateComponent } from "./clients/client-create/client-create.component";
import { LOVListComponent } from "./lovs/lovs-list/lovs-list.component";
import { LOVCreateComponent } from "./lovs/lovs-create/lovs-create.component";
import { ProjectListComponent } from "./projects/projects-list/projects-list.component";
import { ProjectCreateComponent } from "./projects/projects-create/projects-create.component";
import { TeamListComponent } from "./teams/teams-list/teams-list.component";
import { TeamCreateComponent } from "./teams/teams-create/teams-create.component";

@NgModule({
  declarations: [
    UserCreateComponent,
    UserListComponent,
    UserChangePasswordComponent,
    ClientListComponent,
    ClientCreateComponent,
    LOVListComponent,
    LOVCreateComponent,
    ProjectListComponent,
    ProjectCreateComponent,
    TeamListComponent,
    TeamCreateComponent
  ],
  imports: [
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule{ }
