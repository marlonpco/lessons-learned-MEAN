import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserListComponent } from "./users/user-list/user-list.component";
import { UserCreateComponent } from "./users/user-create/user-create.component";
import { AuthGuard } from "../auth/auth.guard";
import { UserChangePasswordComponent } from "./users/user-cp/user-cp.component";
import { ClientListComponent } from "./clients/client-list/client-list.component";
import { ClientCreateComponent } from "./clients/client-create/client-create.component";
import { LOVListComponent } from "./lovs/lovs-list/lovs-list.component";
import { LOVCreateComponent } from "./lovs/lovs-create/lovs-create.component";
import { ProjectListComponent } from "./projects/projects-list/projects-list.component";
import { ProjectCreateComponent } from "./projects/projects-create/projects-create.component";
import { TeamListComponent } from "./teams/teams-list/teams-list.component";
import { TeamCreateComponent } from "./teams/teams-create/teams-create.component";


const routes: Routes = [
  { path: "users", redirectTo:"/admin/users/list", pathMatch:'full' },
  { path: "users/list", component:  UserListComponent, canActivate: [AuthGuard] },
  { path: "users/create", component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: "users/edit/:id", component: UserCreateComponent, canActivate: [AuthGuard] },
  { path: "users/changepwd", component: UserChangePasswordComponent, canActivate: [AuthGuard] },

  { path: "clients", redirectTo:"/admin/clients/list", pathMatch:'full' },
  { path: "clients/list", component:  ClientListComponent, canActivate: [AuthGuard] },
  { path: "clients/create", component: ClientCreateComponent, canActivate: [AuthGuard] },
  { path: "clients/edit/:id", component: ClientCreateComponent, canActivate: [AuthGuard] },

  { path: "lovs", redirectTo:"/admin/lovs/list", pathMatch:'full' },
  { path: "lovs/list", component:  LOVListComponent, canActivate: [AuthGuard] },
  { path: "lovs/create", component: LOVCreateComponent, canActivate: [AuthGuard] },
  { path: "lovs/edit/:id", component: LOVCreateComponent, canActivate: [AuthGuard] },

  { path: "projects", redirectTo:"/admin/projects/list", pathMatch:'full' },
  { path: "projects/list", component:  ProjectListComponent, canActivate: [AuthGuard] },
  { path: "projects/create", component: ProjectCreateComponent, canActivate: [AuthGuard] },
  { path: "projects/edit/:id", component: ProjectCreateComponent, canActivate: [AuthGuard] },

  { path: "teams", redirectTo:"/admin/teams/list", pathMatch:'full' },
  { path: "teams/list", component:  TeamListComponent, canActivate: [AuthGuard] },
  { path: "teams/create", component: TeamCreateComponent, canActivate: [AuthGuard] },
  { path: "teams/edit/:id", component: TeamCreateComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AdminRoutingModule {}
