import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Lessons } from "../shared/models/lessons/lessons.model";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { LessonsSearch } from "../shared/models/lessons/lesson-search.model";

const BACKEND_URL = environment.apiUrl + "/lessons/";

@Injectable({ providedIn: "root" })
export class LessonsService {
  private lessons: Lessons[] = [];
  private lessonsUpdated = new Subject<{ lessons: Lessons[]; count: number }>();

  constructor(private _http: HttpClient, private _router: Router) {}

  addLesson(lesson: Lessons) {
    this._http
      .post<{ message: string; lesson: any }>(BACKEND_URL, lesson)
      .subscribe((reply) => {
        this.routeToLessonsList();
      });
  }

  updateLesson(lesson: Lessons){
    this._http.put(BACKEND_URL + lesson.id, lesson).subscribe(reply => {
      this.routeToLessonsList();
    });
  }

  deleteLesson(id: string) {
    return this._http.delete(BACKEND_URL + id);
  }

  getLesson(id: string){
    return this._http.get<{
      _id: string,
      project: string,
      type: string,
      classification: string,
      severity: string,
      case: string,
      impact: string,
      remidiation: string,
      lesson: string,
      creationDate: string,
      creator: string
    }>(BACKEND_URL + id);
  }

  getLessons(lessonsPerPage: number, currentPage: number, filters?: LessonsSearch) {
    let queryParams = `?pagesize=${lessonsPerPage}&page=${currentPage}`;
    queryParams = this.composeFilters(queryParams, filters);
    this._http
      .get<{ message: string; lessons: any; count: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((data) => {
          return {
            lessons: data.lessons.map((lesson) => {
              return {
                id: lesson._id,
                case: lesson.case,
                impact: lesson.impact,
                remidiation: lesson.remidiation,
                lesson: lesson.lesson,
                creationDate: lesson.creationDate,
                creator: lesson.creator
              };
            }),
            count: data.count,
          };
        })
      )
      .subscribe((transformedData) => {
        this.lessons = transformedData.lessons;
        this.lessonsUpdated.next({
          lessons: [...this.lessons],
          count: transformedData.count,
        });
      });
  }

  getLessonsUpdateListener() {
    return this.lessonsUpdated.asObservable();
  }

  private routeToLessonsList(){
    this._router.navigate(["/lessons/list"]);
  }

  private composeFilters(existingParams: string, filters: LessonsSearch){
    let params ="";

    if(filters.lesson !== null){
      params += `&lesson=${filters.lesson}`
    }

    if(filters.dateFrom !== null){
      params += `&datefrom=${filters.dateFrom}`
    }

    if(filters.dateTo !== null){
      params += `&dateto=${filters.dateTo}`
    }

    if(filters.project !== null){
      params += `&project=${filters.project}`
    }

    if(filters.type !== null){
      params += `&type=${filters.type}`
    }

    if(filters.classification !== null){
      params += `&classification=${filters.classification}`
    }

    if(filters.severity !== null){
      params += `&severity=${filters.severity}`
    }

    return existingParams + params;
  }
}
