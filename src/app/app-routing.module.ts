import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "", redirectTo:"/lessons/list", pathMatch:'full' },
  { path: "lessons", loadChildren: "./lessons/lessons.module#LessonsModule"},
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
  { path: "admin", loadChildren: "./admin/admin.module#AdminModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
