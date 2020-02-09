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

  constructor(private http: HttpClient) { }

  getApiEvents(): Observable<Event[]> {
    this.events = [];

    return this.http.get<Event[]>('api/events', {
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
