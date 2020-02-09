import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Timeline } from '../models/timeline';

@Injectable({
  providedIn: 'root'
})

export class TimelineService {
  private timelines: Timeline[];

  constructor(private http: HttpClient) { }

  getApiTimelines() {
    this.timelines = [];

    return this.http.get<Event[]>('api/timelines?order_by=ascending', {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'timelines')
    });
  }

  createApiTimeline(timeline: Timeline): Observable<any> {
    console.log('Creating new timeline: ', timeline);
  }

  setTimeline(timeline: Timeline) {
    this.timelines.push(timeline);
  }

  getTimelines() {
    return this.timelines;
  }
}
