import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Event } from '../models/events/event';
import { EventNote } from '../models/events/event-note';
import { EventNotePost } from '../models/events/posts/event-note-post';
import { EventPost } from '../models/events/posts/event-post';
import {EventResponse, EventTimelinesResponse, TimelineEventsResponse} from '../models/responses/event-response';
import {TimelineEvent} from '../models/timelines/timeline-event';
import {EventTimeline} from '../models/events/event-timeline';
import {TimelineEventPost} from '../models/posts/timeline-event-post';
import {Timeline} from '../models/timelines/timeline';
import {PersonTimelinesResponse} from '../models/responses/person-response';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: Event[];

  private eventNotePost: EventNotePost;
  private eventPost: EventPost;
  private timelineEventPost: TimelineEventPost;

  private filterObject: Array<any>;

  private eventTimelines: TimelineEvent[];

  constructor(private http: HttpClient) {
    this.events = [];
    this.eventTimelines = [];
    this.filterObject = [];
  }

  static removeEventNote(event: Event, note: EventNote) {
    for (let i = 0; i < event.notes.length; i++) {
      if (event.notes[i].id === note.id) {
        event.notes.splice(i, 1);
      }
    }
  }

  getApiEvents(path, filterTerm, dateFilter, isPageLink): Observable<EventResponse> {
    this.filterObject = [];

    this.events = [];

    // if this is a page link the path is already fully formed. as such skip.
    if (!isPageLink) {
      if (!path) {
        path = '/events';

        if ((filterTerm) || (!filterTerm && dateFilter)) {
          path = path + '?';
        }
      } else {
        if (filterTerm || dateFilter) {
          path = path + '&';
        }
      }

      if (filterTerm) {
        const searchFilter = {
          or: [
            {
              name: 'description',
              op: 'ilike',
              val: '%' + filterTerm + '%'
            },
            {
              name: 'label',
              op: 'ilike',
              val: '%' + filterTerm + '%'
            }
          ]
        };

        this.filterObject.push(searchFilter);
      }

      if (dateFilter) {
        if (dateFilter.length === 2) {
          let addEraFilter = true;

          let startDateOperator = 'gt';

          if (dateFilter[0][1].toUpperCase() === 'BC') {
            startDateOperator = 'lt';
          }

          let endDateOperator = 'lt';

          if (dateFilter[1][1].toUpperCase() === 'BC') {
            endDateOperator = 'gt';
          }

          // In the case that the search is between BC and AD
          if (dateFilter[0][1].toUpperCase() === 'BC' && dateFilter[1][1].toUpperCase() === 'AD') {
            addEraFilter = false;
          }

          const startDateFilter = {
            name: 'event_start_year',
            op: startDateOperator,
            val: dateFilter[0][0]
          };

          const endDateFilter = {
            name: 'event_end_year',
            op: endDateOperator,
            val: dateFilter[1][0]
          };

          const startDateEraFilter = {
            name: 'event_start_era_rel',
            op: 'has',
            val: {
              name: 'label',
              op: 'eq',
              val: dateFilter[0][1]
            }
          };

          const endDateEraFilter = {
            name: 'event_end_era_rel',
            op: 'has',
            val: {
              name: 'label',
              op: 'eq',
              val: dateFilter[1][1]
            }
          };

          this.filterObject.push(startDateFilter);
          this.filterObject.push(endDateFilter);

          if (addEraFilter) {
            this.filterObject.push(startDateEraFilter);
            this.filterObject.push(endDateEraFilter);
          }
        }
      }

      if (this.filterObject.length) {
        const filterQuery = JSON.stringify(this.filterObject);

        path = path + 'filter=' + filterQuery;
      }
    }

    return this.http.get<EventResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'events')
    });
  }

  getApiEvent(eventId): Observable<Event> {
    return this.http.get<Event>(environment.apiUrl + '/events/' + eventId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'event')
    });
  }

  getApiEventTimelines(event: Event): Observable<EventTimelinesResponse> {
    this.filterObject = [];

    this.eventTimelines = [];

    let path = '/timeline_events';

    const eventFilter = {
      name: 'event_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: event.id.toString()
      }
    };

    this.filterObject.push(eventFilter);

    const filterQuery = JSON.stringify(this.filterObject);

    path = path + '?filter=' + filterQuery;

    path = path + '&page[size]=0';

    return this.http.get<EventTimelinesResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'event_timelines')
    });
  }

  getApiTimelineEvents(timeline: Timeline): Observable<TimelineEventsResponse> {
    this.filterObject = [];

    this.eventTimelines = [];

    let path = '/timeline_events';

    const timelineFilter = {
      name: 'timeline_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: timeline.id.toString()
      }
    };

    this.filterObject.push(timelineFilter);

    const filterQuery = JSON.stringify(this.filterObject);

    path = path + '?filter=' + filterQuery;

    path = path + '&page[size]=0';

    return this.http.get<TimelineEventsResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'timeline_events')
    });
  }

  createApiEvent(event: Event): Observable<any> {
    this.eventPost = new EventPost();
    this.eventPost.mapToPost(event, false);

    return this.http.post(environment.apiUrl + '/events', this.eventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createTimelineApiEvent(eventTimeline: EventTimeline, event: Event): Observable<any> {
    this.timelineEventPost = new TimelineEventPost();
    this.timelineEventPost.mapToPost(event, eventTimeline.timeline, false, 0, false, null);

    return this.http.post(environment.apiUrl + '/timeline_events', this.timelineEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiEvent(event: Event): Observable<any> {
    this.eventPost = new EventPost();
    this.eventPost.mapToPost(event, true);

    return this.http.patch(environment.apiUrl + '/events/' + event.id, this.eventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiEvent(event: Event): Observable<any> {
    return this.http.delete(environment.apiUrl + '/events/' + event.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeTimelineApiEvent(eventTimeline: EventTimeline): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_events/' + eventTimeline.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  createApiEventNote(note: EventNote, event: Event): Observable<any> {
    this.eventNotePost = new EventNotePost();
    this.eventNotePost.mapToPost(note, event, false);

    return this.http.post(environment.apiUrl + '/event_notes', this.eventNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEventImage(imageForm: FormData): Observable<any> {
    return this.http.post(environment.apiUrl + '/upload_event_image', imageForm, {responseType: 'text'});
  }

  patchApiEventNote(note: EventNote, event: Event): Observable<any> {
    this.eventNotePost = new EventNotePost();
    this.eventNotePost.mapToPost(note, event, true);

    return this.http.patch(environment.apiUrl + '/event_notes/' + note.id, this.eventNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiNote(note: EventNote): Observable<any> {
    return this.http.delete(environment.apiUrl + '/event_notes/' + note.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeEvent(event: Event) {
    for (let i = 0; i < this.events.length; i++) {
      if (this.events[i].id === event.id) {
        this.events.splice(i, 1);
      }
    }
  }

  setEvent(event: Event) {
    this.events.push(event);
  }

  getEvents() {
    return this.events;
  }
}
