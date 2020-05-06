import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordListComponent } from './record-list/record-list.component';
import { LoginComponent } from './login/login.component';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddEditRecordComponent } from './add-edit-record/add-edit-record.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from '../shared/_alert';

@NgModule({
  declarations: [
    RecordListComponent,
    LoginComponent, 
    AddEditRecordComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    FormsModule,
    AlertModule
  ],
  exports: [LoginComponent, RecordListComponent]
})
export class LessonsLearnedModule { }
