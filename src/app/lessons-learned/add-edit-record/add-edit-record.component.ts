import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { LessonsLearnedService } from '../lessons-learned.service';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Lessons } from 'src/app/shared/classes/lessons';
import { AlertService } from 'src/app/shared/_alert';

@Component({
  selector: 'app-add-edit-record',
  templateUrl: './add-edit-record.component.html',
  styleUrls: ['./add-edit-record.component.scss']
})
export class AddEditRecordComponent implements OnInit {

  state: Observable<Object>;
  lesson: Lessons = null;

  lessonForm =  new FormGroup({
    date: new FormControl(''),
    project: new FormControl(''),
    severity: new FormControl(''),
    case: new FormControl(''),
    impact: new FormControl(''),
    type: new FormControl(''),
    classification: new FormControl(''),
    contributor: new FormControl(''),
    remediation: new FormControl(''),
    lesson: new FormControl('')
  })

  options = {
    autoClose: true,
    keepAfterRouteChange: false
  }

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private lessonLearnedService: LessonsLearnedService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.lesson = history.state;
    if (this.lesson.id != undefined) {
      this.lessonForm.setValue({
        date: this.lesson.date,
        project: this.lesson.project,
        severity: this.lesson.severity,
        case: this.lesson.case,
        impact: this.lesson.impact,
        type: this.lesson.type,
        classification: this.lesson.classification,
        contributor: this.lesson.contributor,
        remediation: this.lesson.remediation,
        lesson: this.lesson.lesson
      })
    }
  }

  save() {
    if (this.lesson.id != undefined) {
      this.lessonLearnedService.modifyLesson(this.lessonForm.value, this.lesson.id)
        .subscribe(data => {
          console.log("Edit successfully");
          this.alertService.success('Success!', this.options);
        })
    } else {
      this.lessonLearnedService.saveLesson(this.lessonForm.value)
        .subscribe(data => {
          console.log("Save successfully");
          this.alertService.success('Success!', this.options);
        });
    }
    
    setTimeout(()=>{
      this.cancel();
    }, 2000);

    // this.lessonForm.reset();
  }

  cancel() {
    this.router.navigate(['/record-list']);
  }

}
