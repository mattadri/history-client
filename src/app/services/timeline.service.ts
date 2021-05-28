import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Timeline } from '../models/timelines/timeline';
import { Event } from '../models/events/event';
import { TimelineEvent } from '../models/timelines/timeline-event';
import { TimelinePerson } from '../models/timelines/timeline-person';

import { TimelinePost } from '../models/posts/timeline-post';
import { TimelineEventPost } from '../models/posts/timeline-event-post';
import { TimelinePersonPost } from '../models/posts/timeline-person-post';
import { TimelineCategoryPost } from '../models/posts/timeline-category-post';

import {TimelineResponse} from '../models/responses/timeline-response';

import {TimelineCategory} from '../models/timelines/timeline-category';
import {TimelineCategoryEventPost} from '../models/posts/timeline-category-event-post';
import {PersonTimeline} from '../models/persons/person-timeline';
import {TimelineUserPost} from '../models/timelines/posts/timeline-user-post';
import {UserResponse} from '../models/users/responses/user-response';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class TimelineService {
  private timelines: Timeline[];
  private users: User[];
  private timelinePost: TimelinePost;
  private timelineEventPost: TimelineEventPost;
  private timelinePersonPost: TimelinePersonPost;
  private timelineCategoryPost: TimelineCategoryPost;
  private timelineCategoryEventPost: TimelineCategoryEventPost;
  private timelineUserPost: TimelineUserPost;

  constructor(private http: HttpClient) {
    this.users = [];
  }

  getApiTimelines(path,
                  userId,
                  pageSize: string,
                  pageNumber: string,
                  fields: Array<string>,
                  sort: Array<string>,
                  sortDescending: boolean,
                  additionalFilters: Array<Object>,
                  isAnotherPage: boolean): Observable<TimelineResponse> {

    this.timelines = [];

    let type = 'timelines';

    // if a next of previous page is being retrieved just all the path as is
    if (!isAnotherPage) {
      if (!path) {
        path = '/timelines';
      }

      // default page size is 20 records per page
      if (!pageSize) {
        pageSize = '20';
      }

      // default page number to 1
      if (!pageNumber) {
        pageNumber = '1';
      }

      let filter = [];

      if (userId) {
        let userFilter = {
          name: 'user_rel',
          op: 'has',
          val: {
            name: 'id',
            op: 'eq',
            val: userId
          }
        };

        filter.push(userFilter);

        path = '/timeline_users';

        type = 'user_timelines';
      }

      path = path + '?page[size]=' + pageSize;

      path = path + '&page[number]=' + pageNumber;

      // add any fields filter to the path
      if (fields && fields.length) {
        path = path + '&fields[timeline]=';

        for (let i = 0; i < fields.length; i++) {
          path = path + fields[i];

          if (i < fields.length -1) {
            path = path + ',';
          }
        }
      }

      // add any sorting if requested
      if (sort && sort.length) {
        path = path + '&sort=';

        if (sortDescending) {
          path = path + '-';
        }

        for (let i = 0; i < sort.length; i++) {
          path = path + sort[i];

          if (i < sort.length - 1) {
            path = path + ',';
          }
        }
      }

      // lastly tack on any additional filters passed
      if (additionalFilters && additionalFilters.length) {
        for (const additionalFilter of additionalFilters) {
          filter.push(additionalFilter);
        }
      }

      if (filter.length) {
        path = path + '&filter=' + JSON.stringify(filter);
      }
    } else {
      // set the type to user if the next page are user timelines
      if (path.includes('/timeline_users')) {
        type = 'user_timelines';
      }
    }

    return this.http.get<TimelineResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
    });
  }

  getApiTimeline(timelineId): Observable<Timeline> {
    return this.http.get<Timeline>(environment.apiUrl + '/timelines/' + timelineId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'timeline')
    });
  }

  getApiTimelineUsers(path: string, timeline: Timeline): Observable<UserResponse> {
    this.users = [];

    if (!path) {
      path = '/timeline_users';
    }

    let filter = [];

    let timelineFilter = {
      name: 'timeline_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: timeline.id
      }
    };

    filter.push(timelineFilter);

    path = path + '?filter=' + JSON.stringify(filter);

    return this.http.get<UserResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'item_user')
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

  createEventApiTimeline(timelineEvent: TimelineEvent, timeline: Timeline): Observable<any> {
    this.timelineEventPost = new TimelineEventPost();
    this.timelineEventPost.mapToPost(timelineEvent.event, timeline, timelineEvent.isShadow, timelineEvent.priority, false, null);

    return this.http.post(environment.apiUrl + '/timeline_events', this.timelineEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createPersonApiTimeline(personTimeline: PersonTimeline): Observable<any> {
    this.timelinePersonPost = new TimelinePersonPost();
    this.timelinePersonPost.mapToPost(personTimeline, false);

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

  addUserToTimeline(timeline: Timeline, userId: string): Observable<any> {
    this.timelineUserPost = new TimelineUserPost();
    this.timelineUserPost.mapToPost(timeline, userId);

    return this.http.post(environment.apiUrl + '/timeline_users', this.timelineUserPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchEventApiTimeline(timelineEvent: TimelineEvent, timeline: Timeline): Observable<any> {
    this.timelineEventPost = new TimelineEventPost();
    this.timelineEventPost.mapToPost(timelineEvent.event, timeline, timelineEvent.isShadow, timelineEvent.priority, true, timelineEvent.id);

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

  removeEventApiTimeline(timelineEvent: TimelineEvent): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_events/' + timelineEvent.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removePersonApiTimeline(timelinePerson: TimelinePerson): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_persons/' + timelinePerson.id, {
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
