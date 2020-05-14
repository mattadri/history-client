import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Timeline } from '../models/timeline';
import { Event } from '../models/event';
import { TimelineEvent } from '../models/timeline-event';
import { TimelinePerson } from '../models/timeline-person';

import { TimelinePost } from '../models/posts/timeline-post';
import { TimelineEventPost } from '../models/posts/timeline-event-post';
import { TimelinePersonPost } from '../models/posts/timeline-person-post';
import { TimelineCategoryPost } from '../models/posts/timeline-category-post';

import {TimelineResponse} from '../models/responses/timeline-response';

import {TimelineCategory} from '../models/timeline-category';
import {TimelineCategoryEventPost} from '../models/posts/timeline-category-event-post';

@Injectable({
  providedIn: 'root'
})

export class TimelineService {
  private timelines: Timeline[];
  private timelinePost: TimelinePost;
  private timelineEventPost: TimelineEventPost;
  private timelinePersonPost: TimelinePersonPost;
  private timelineCategoryPost: TimelineCategoryPost;
  private timelineCategoryEventPost: TimelineCategoryEventPost;

  constructor(private http: HttpClient) { }

  getApiTimelines(path) {
    this.timelines = [];

    return this.http.get<TimelineResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'timelines')
    });
  }

  getApiTimeline(timelineId) {
    return this.http.get<Timeline>(environment.apiUrl + '/timelines/' + timelineId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'timeline')
    });
  }

  createApiTimeline(timeline: Timeline): Observable<any> {
    this.timelinePost = new TimelinePost();
    this.timelinePost.mapToPost(timeline, false);

    return this.http.post(environment.apiUrl + '/timelines', this.timelinePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiTimeline(timeline: Timeline): Observable<any> {
    this.timelinePost = new TimelinePost();
    this.timelinePost.mapToPost(timeline, true);

    return this.http.patch(environment.apiUrl + '/timelines/' + timeline.id, this.timelinePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createEventApiTimeline(timelineEvent: TimelineEvent): Observable<any> {
    this.timelineEventPost = new TimelineEventPost();
    this.timelineEventPost.mapToPost(timelineEvent, false);

    return this.http.post(environment.apiUrl + '/timeline_events', this.timelineEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createPersonApiTimeline(timelinePerson: TimelinePerson): Observable<any> {
    this.timelinePersonPost = new TimelinePersonPost();
    this.timelinePersonPost.mapToPost(timelinePerson, false);

    return this.http.post(environment.apiUrl + '/timeline_persons', this.timelinePersonPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createCategoryApiTimeline(timelineCategory: TimelineCategory, timeline: Timeline): Observable<any> {
    this.timelineCategoryPost = new TimelineCategoryPost();
    this.timelineCategoryPost.mapToPost(timelineCategory, timeline);

    return this.http.post(environment.apiUrl + '/timeline_categories', this.timelineCategoryPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createCategoryEventApiTimeline(timelineCategory: TimelineCategory, event: Event): Observable<any> {
    this.timelineCategoryEventPost = new TimelineCategoryEventPost();
    this.timelineCategoryEventPost.mapToPost(timelineCategory, event);

    return this.http.post(environment.apiUrl + '/timeline_category_events', this.timelineCategoryEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchEventApiTimeline(timeline: Timeline, event: Event): Observable<any> {
    const timelineEvent = new TimelineEvent();
    timelineEvent.mapTimelineEvent(timeline, event);

    this.timelineEventPost = new TimelineEventPost();
    this.timelineEventPost.mapToPost(timelineEvent, true);

    return this.http.patch(environment.apiUrl + '/timeline_events/' + timelineEvent.id, this.timelineEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeCategoryApiTimeline(categoryId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_categories/' + categoryId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeEventApiTimeline(timelineEventId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_events/' + timelineEventId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removePersonApiTimeline(timelinePersonId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_persons/' + timelinePersonId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeCategoryEventApiTimeline(categoryEventId: number): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_category_events/' + categoryEventId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  setTimeline(timeline: Timeline) {
    this.timelines.push(timeline);
  }

  getTimelines() {
    return this.timelines;
  }
}
