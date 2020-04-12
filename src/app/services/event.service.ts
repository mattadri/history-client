import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Event } from '../models/event';
import { EventNote } from '../models/event-note';
import { EventNotePost } from '../models/posts/event-note-post';
import { EventPost } from '../models/posts/event-post';

@Injectable({
  providedIn: 'root'
})

export class EventService {
  private events: Event[];
  private eventNotePost: EventNotePost;
  private eventPost: EventPost;

  private filterObject: array;

  constructor(private http: HttpClient) {
    this.filterObject = [];
  }

  getApiEvents(path, filterTerm, dateFilter, isPageLink): Observable<Event[]> {
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
          const startDateFilter = {
            name: 'event_start_year',
            op: 'gt',
            val: dateFilter[0]
          };

          const endDateFilter = {
            name: 'event_end_year',
            op: 'lt',
            val: dateFilter[1]
          };

          this.filterObject.push(startDateFilter);
          this.filterObject.push(endDateFilter);
        }
      }

      if (this.filterObject.length) {
        const filterQuery = JSON.stringify(this.filterObject);

        path = path + 'filter=' + filterQuery;
      }
    }

    return this.http.get<Event[]>('api' + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'events')
    });
  }

  createApiEvent(event: Event): Observable<Event> {
    this.eventPost = new EventPost();
    this.eventPost.mapToPost(event);

    return this.http.post('/api/events', this.eventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiEvent(event: Event): Observable<Event> {
    this.eventPost = new EventPost();
    this.eventPost.mapToPost(event, true);

    return this.http.patch('/api/events/' + event.id, this.eventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiEvent(event: Event): Observable<any> {
    return this.http.delete('/api/events/' + event.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  createApiEventNote(note: EventNote, event: Event): Observable<any> {
    this.eventNotePost = new EventNotePost();
    this.eventNotePost.mapToPost(note, event);

    return this.http.post('/api/event_notes', this.eventNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiNote(note: EventNote): Observable<any> {
    return this.http.delete('/api/event_notes/' + note.id, {
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

  removeEventNote(event: Event, note: EventNote) {
    for (let i = 0; i < event.notes.length; i++) {
      if (event.notes[i].id === note.id) {
        event.notes.splice(i, 1);
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
