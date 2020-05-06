import {SelectionModel} from '@angular/cdk/collections';
import {Component, OnInit, ViewChild, SimpleChanges, Input} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import { Router, NavigationExtras } from '@angular/router';
import { LessonsLearnedService } from '../lessons-learned.service';
import { Lessons } from 'src/app/shared/classes/lessons';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.scss']
})
export class RecordListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'lessonsLearned', 'contributor', 'date'];
  dataSource: MatTableDataSource<Lessons>;
  @Input() selection = new SelectionModel<Lessons>(true, []);
  paging: boolean = true;
  selectedValue: Lessons[];
  showDelete: boolean = false;
  showModify: boolean = false;
  lesson: Lessons;
  lessonDelete: number = 0;
  recordCount: number = 0;

  listLessons: Lessons[];

  @ViewChild(MatPaginator, null) paginator: MatPaginator;

  constructor(private router: Router, private lessonLearnedService: LessonsLearnedService) { }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  checkboxLabel(row?: Lessons): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.project + 1}`;
  }

  ngOnInit() {
    this.searchRecord();
  }

  createRecord() {
    this.router.navigate(['/add-edit-record']);
  }

  modifyRecord() {
    this.lesson = this.selection.selected[0];
    let data: NavigationExtras = {
      queryParams: {
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
      }
    }
    this.router.navigateByUrl('/add-edit-record',  {state: this.lesson});

    this.dataSource = new MatTableDataSource<Lessons>(this.listLessons);
    this.dataSource.paginator = this.paginator;
  }

  deleteRecord() {
    this.selectedValue = this.selection.selected;
    console.log("Selected: ", this.selectedValue);
    this.lessonLearnedService.deleteLessons(this.selectedValue);
    this.selection.clear();
    this.lessonLearnedService.getLessons()
    .subscribe(
      data => {
        this.listLessons = data;
        console.log("This is the mock data: ", this.listLessons);
      }
    );

    this.dataSource = new MatTableDataSource<Lessons>(this.listLessons);
    this.dataSource.paginator = this.paginator;
  }

  searchRecord() {
    this.lessonLearnedService.getLessons()
    .subscribe(
      data => {
        this.listLessons = data;
        console.log("This is the mock data: ", this.listLessons);
        this.dataSource = new MatTableDataSource<Lessons>(this.listLessons);
        this.dataSource.paginator = this.paginator;
      }
    );
  }

  recordSelected() {
    console.log(this.selection.selected);
    console.log(this.selection.selected.length);
    this.recordCount = this.selection.selected.length;
    if (this.recordCount == 1) {
      this.showDelete = true;
      this.showModify = true;
    } else if (this.recordCount > 1) {
      this.showDelete = true;
      this.showModify = false;
    } else {
      this.showDelete = false;
      this.showModify = false;
    }
  }
}
