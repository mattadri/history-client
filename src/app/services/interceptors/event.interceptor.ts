import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

import { Event } from '../../models/event';

@Injectable()
export class EventInterceptor implements HttpInterceptor {
  private body = {
    events: [],
    total: 0,
    links: {}
  };

  private events: Event[] = [];
  private event: Event;

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        this.handleResponse(req, evt);
      })
    );
  }

  handleResponse(req: HttpRequest<any>, event) {
    if (event.body) {
      if (req.headers.headers.get('type')) {
        if (req.headers.headers.get('type')[0] === 'events') {
          this.events = [];

          for (const data of event.body.data) {
            this.event = new Event();
            this.event.mapEvent(data);

            this.events.push(this.event);
          }

          this.body.events = this.events;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;
        } else if (req.headers.headers.get('type')[0] === 'event') {
          this.event = new Event();
          this.event.mapEvent(event.body.data);

          event.body = this.event;
        }
      }
    }
  }
}
