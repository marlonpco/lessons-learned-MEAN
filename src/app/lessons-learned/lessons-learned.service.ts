import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Lessons } from '../shared/classes/lessons';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LessonsLearnedService {

  constructor(private httpClient: HttpClient) { }

  getLessons(): Observable<any> {
    return this.httpClient.get("https://lessons-learned-4d6ca.firebaseio.com/lessons.json")
            .pipe(map((data) => {
              console.log(data)
              let lessons = [];

              for(let key in data) {
                console.log("status: ", data[key].status);
                if (data[key].status) {
                  lessons.push({
                    id: key,
                    date: data[key].date,
                    project: data[key].project,
                    severity: data[key].severity,
                    case: data[key].case,
                    impact: data[key].impact,
                    type: data[key].type,
                    classification: data[key].classification,
                    contributor: data[key].contributor,
                    remediation: data[key].remediation,
                    lesson: data[key].lesson
                  })
                }
              }
              return lessons;
            })
            );
  }

  saveLesson(data: Lessons): Observable<any> {
    data.status = true;
    return this.httpClient.post("https://lessons-learned-4d6ca.firebaseio.com/lessons.json", data);
  }

  modifyLesson(data: Lessons, id: string) {
    // Only for representation. Need modification
    data.id = id;
    return this.httpClient.patch("https://lessons-learned-4d6ca.firebaseio.com/lessons/"+id+".json", data);
  }

  deleteLessons(data: Lessons[]) {
    // Will pass the data (contains list of id and other values needed for soft or hard delete)
    // Calls API
  }
}
