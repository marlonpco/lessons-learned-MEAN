import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { LessonsService } from "../lessons.service";
import { Lessons } from "../../shared/models/lessons/lessons.model";
import { environment } from "../../../environments/environment";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { Util } from '../../shared/utilities/utilities';
import { Project } from "../../shared/models/admin/projects.model";
import { LOV } from "../../shared/models/admin/lovs.model";
import { LOVService } from "../../admin/lovs/lovs.service";
import { AuthService } from "../../auth/auth.service";
import { TeamService } from "../../admin/teams/teams.service";
import { LOVConstant } from "src/app/admin/lovs/lovs.constant";

@Component({
  templateUrl: "./lessons-create.component.html",
  styleUrls: ["./lessons-create.component.css"],
})
export class LessonsCreateComponent implements OnInit, OnDestroy {
  public isLoading: boolean = false;
  public form: FormGroup;
  public rowNumber: string = environment.textAreaRowNumber;
  public componentMode: string = Util.MODE_CREATE;
  private lessonId: string = null;
  private creationDate: string = null;
  private lesson: Lessons;

  public userName: string;
  public dateCreated: string;
  public projects: Project[];
  public types: LOV[];
  public classifications: LOV[];
  public severities: LOV[];

  private projectsSubscription: Subscription;
  private typesSubscription: Subscription;
  private classificationSubscription: Subscription;
  private severitiesSubscription: Subscription;

  constructor(
    private _fb: FormBuilder,
    private _lessonService: LessonsService,
    private _teamService: TeamService,
    private _lovService: LOVService,
    private _authService: AuthService,
    private _router: Router,
    public _route: ActivatedRoute
  ) {}

  ngOnDestroy(){
    this.projectsSubscription.unsubscribe();
    this.typesSubscription.unsubscribe();
    this.classificationSubscription.unsubscribe();
    this.severitiesSubscription.unsubscribe();
  }

  ngOnInit() {
    this.initializeData();
    this.buildForm();
    this._route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.isLoading = true;
        this.componentMode = Util.MODE_EDIT;
        this.lessonId = paramMap.get("id");

        this._lessonService.getLesson(this.lessonId).subscribe((data) => {
          this.isLoading = false;
          this.creationDate = data.creationDate;
          this.lesson = {
            id: data._id,
            project: data.project,
            type: data.type,
            classification: data.classification,
            severity: data.severity,
            case: data.case,
            impact: data.impact,
            remidiation: data.remidiation,
            lesson: data.lesson,
            creationDate: data.creationDate,
            creator: data.creator
          };

          this.form.setValue({
            project: this.lesson.project,
            type: this.lesson.type,
            classification: this.lesson.classification,
            severity: this.lesson.severity,
            case: this.lesson.case,
            impact: this.lesson.impact,
            remidiation: this.lesson.remidiation,
            lesson: this.lesson.lesson,
          });

          this.dateCreated = this.lesson.creationDate;
        });
      } else {
        this.componentMode = Util.MODE_CREATE;
        this.lessonId = "";
        this.creationDate = null;
        this.userName = this._authService.getDisplayName();
        this.dateCreated = (new Date()).toLocaleDateString();
      }
    });
  }

  onSave() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const lesson: Lessons = {
      id: this.lessonId,
      project: this.form.value.project,
      type: this.form.value.type,
      classification: this.form.value.classification,
      severity: this.form.value.severity,
      case: this.form.value.case,
      impact: this.form.value.impact,
      remidiation: this.form.value.remidiation,
      lesson: this.form.value.lesson,
      creationDate: this.creationDate,
      creator: null
    };

    if (this.componentMode === Util.MODE_CREATE) {
      this._lessonService.addLesson(lesson);
    } else {
      this._lessonService.updateLesson(lesson);
    }
  }

  onBack() {
    this._router.navigate(["/lessons/list"]);
  }

  getModeCreate(){
    return Util.MODE_CREATE;
  }

  private initializeData(){
    let userId = this._authService.getUserId();
    this._teamService.loadData(userId);
    this.projectsSubscription = this._teamService.getTeamsDropDownUpdatedListener()
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

  private buildForm(){
    this.form = this._fb.group({
      project: ["", Validators.required],
      type: ["", Validators.required],
      classification: ["", Validators.required],
      severity: ["", Validators.required],
      case: ["", Validators.required],
      impact: ["", Validators.required],
      remidiation: ["", Validators.required],
      lesson: ["", Validators.required],
    });
  }
}
