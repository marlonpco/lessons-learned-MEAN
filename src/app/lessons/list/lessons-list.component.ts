import { Component, OnInit, OnDestroy } from '@angular/core';
import { LessonsService } from '../lessons.service';
import { Lessons } from '../../shared/models/lessons/lessons.model';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { LessonsSearch } from '../../shared/models/lessons/lesson-search.model';
import { Util } from '../../shared/utilities/utilities';
import { ProjectService } from '../../admin/projects/projects.service';
import { LOVService } from '../../admin/lovs/lovs.service';
import { Project } from '../../shared/models/admin/projects.model';
import { LOV } from '../../shared/models/admin/lovs.model';
import { LOVConstant } from 'src/app/admin/lovs/lovs.constant';

@Component({
  templateUrl: './lessons-list.component.html',
  styleUrls: ['./lessons-list.component.css']
})
export class LessonsListComponent implements OnInit, OnDestroy{
  public displayedColumns: string[] = ['lesson', 'case', 'impact', 'remidiation', 'creationDate', 'id'];
  public dataSource: any;
  private lessonsSubscription: Subscription;
  public totalLessons = 0;
  public lessonsPerPage = 10;
  public currentPage = 1;
  public pageSizeOptions = [10, 20, 50, 100];
  public isLoading = false;

  public isUserAuthenticated: boolean = false;
  public authSubscription: Subscription;
  public authUserId: string = null;

  public form: FormGroup;
  private filters: LessonsSearch;

  public isAdmin: boolean = false;

  public projects: Project[];
  public types: LOV[];
  public classifications: LOV[];
  public severities: LOV[];

  private projectsSubscription: Subscription;
  private typesSubscription: Subscription;
  private classificationSubscription: Subscription;
  private severitiesSubscription: Subscription;

  constructor(
    private _authService: AuthService,
    private _lessonsService : LessonsService,
    private _projectService: ProjectService,
    private _lovService: LOVService,
    private _router: Router,
    private _fb: FormBuilder
  ){}

  ngOnInit(){
    this.initializeFilter();
    this.initializeDropdown();
    this.buildForm();
    this.isLoading = true;
    this.getLessons();
    this.lessonsSubscription = this._lessonsService.getLessonsUpdateListener()
      .subscribe((lessonsData: {lessons: Lessons[], count: number }) => {
        this.isLoading = false;
        this.dataSource = lessonsData.lessons;
        this.totalLessons = lessonsData.count;
      });

    this.isAdmin = this._authService.isAdmin();
    this.isUserAuthenticated = this._authService.getIsAuthenticated();
    this.authUserId = this._authService.getUserId();
    this.authSubscription = this._authService.getAuthStatusListener().subscribe(
      isAuthenticated => {
        this.isUserAuthenticated = isAuthenticated;
        this.authUserId = this._authService.getUserId();
        this.isAdmin = this._authService.isAdmin();
      }
    );
  }

  ngOnDestroy(){
    this.lessonsSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
    this.projectsSubscription.unsubscribe();
    this.typesSubscription.unsubscribe();
    this.classificationSubscription.unsubscribe();
    this.severitiesSubscription.unsubscribe();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.lessonsPerPage = pageData.pageSize;
    this.getLessons();
  }

  onDelete(id: string){
    this.isLoading=true;
    this._lessonsService.deleteLesson(id)
      .subscribe(() => {
        this.getLessons();
      }, () => {
        this.isLoading=false;
      });
  }

  onEdit(id: string){
    this._router.navigate(['/lessons/edit', id]);
  }

  onSearch(){

    if(this.form.value.project !== null && this.form.value.project !== ''){
      this.filters.project = this.form.value.project;
    }

    if(this.form.value.type !== null && this.form.value.type !== ''){
      this.filters.type = this.form.value.type;
    }

    if(this.form.value.classification !== null && this.form.value.classification !== ''){
      this.filters.classification = this.form.value.classification;
    }

    if(this.form.value.severity !== null && this.form.value.severity !== ''){
      this.filters.severity = this.form.value.severity;
    }

    if(this.form.value.lesson !== null && this.form.value.lesson !== ''){
      this.filters.lesson = Util.convertToBackendString(this.form.value.lesson);
    }

    if(this.form.value.dateFrom !== null && this.form.value.dateFrom !== ''){
      let dateFrom = this.form.value.dateFrom.toLocaleDateString();
      this.filters.dateFrom = Util.convertToBackendDate(dateFrom);
    }

    if(this.form.value.dateTo !== null && this.form.value.dateTo !== ''){
      let dateTo = this.form.value.dateTo.toLocaleDateString();
      this.filters.dateTo = Util.convertToBackendDate(dateTo);
    }

    this.getLessons();
  }

  onClear(){
    this.initializeFilter();
    this.form.reset();
    this.getLessons();
  }

  private getLessons(){
    this._lessonsService.getLessons(this.lessonsPerPage, this.currentPage, this.filters);
  }

  private buildForm(){
    this.form = this._fb.group({
      lesson: ["", null],
      dateFrom: ["", null],
      dateTo: ["", null],
      project: ["", null],
      type: ["", null],
      classification: ["", null],
      severity: ["", null],
    });
  }

  private initializeFilter(){
    this.filters = {
      lesson: null,
      dateFrom: null,
      dateTo: null,
      project: null,
      type: null,
      classification: null,
      severity: null
    }
  }

  private initializeDropdown(){
    this._projectService.loadData();
    this.projectsSubscription = this._projectService.getProjectsUpdatedListener()
    .subscribe(data => {
      this.projects = data.projects;
    });

    this._lovService.loadDataByCode(LOVConstant.TYPE);
    this.typesSubscription = this._lovService.getTypesUpdatedListener()
    .subscribe(data => {
      this.types = data.types;
    });

    this._lovService.loadDataByCode(LOVConstant.CLASSIFICATION);
    this.classificationSubscription = this._lovService.getClassificationsUpdatedListener()
    .subscribe(data => {
      this.classifications = data.classifications;
    });

    this._lovService.loadDataByCode(LOVConstant.SEVERITY);
    this.severitiesSubscription = this._lovService.getSeveritiesUpdatedListener()
    .subscribe(data => {
      this.severities = data.severities;
    });
  }
}
