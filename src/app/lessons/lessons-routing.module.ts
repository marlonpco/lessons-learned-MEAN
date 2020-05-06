import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LessonsCreateComponent } from "./create/lessons-create.component";
import { LessonsListComponent } from "./list/lessons-list.component";
import { AuthGuard } from "../auth/auth.guard";

const routes: Routes = [
  { path: "create", component: LessonsCreateComponent, canActivate: [AuthGuard] },
  { path: "list", component: LessonsListComponent },
  { path: "edit/:id", component: LessonsCreateComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class LessonsRoutingModule {}
