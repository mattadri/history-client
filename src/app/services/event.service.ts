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

  getApiEvents(path,
               pageSize: string,
               pageNumber: string,
               include: Array<string>,
               fields: Array<string>,
               sort: Array<string>,
               sortDescending: boolean,
               additionalFilters: Array<Object>,
               isAnotherPage: boolean): Observable<EventResponse> {
    let type = 'events';

    // if a next or previous page is being retrieved just leave the path as is
    if (!isAnotherPage) {
      if (!path) {
        path = '/events';
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

      path = path + '?page[size]=' + pageSize;

      path = path + '&page[number]=' + pageNumber;

      // include any related objects
      if (include && include.length) {
        path = path + '&include=';

        for (let i = 0; i < include.length; i++) {
          path = path + include[i];

          if (i < include.length - 1) {
            path = path + ',';
          }
        }
      }

      // add any fields filter to the path
      if (fields && fields.length) {
        path = path + '&fields[event]=';

        for (let i = 0; i < fields.length; i++) {
          path = path + fields[i];

          if (i < fields.length - 1) {
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
    }

    return this.http.get<EventResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
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

  getEvent(eventId: string): Event {
    for (const event of this.events) {
      if (eventId.toString() === event.id.toString()) {
        return event;
      }
    }
  }
}
