import { NgModule } from '@angular/core';

import { MaterialModule } from '../material.module';
import { LessonsListComponent } from './list/lessons-list.component';
import { LessonsCreateComponent } from './create/lessons-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LessonsRoutingModule } from './lessons-routing.module';

@NgModule({
  declarations: [
    LessonsListComponent,
    LessonsCreateComponent
  ],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    LessonsRoutingModule
  ]
})
export class LessonsModule{

}
