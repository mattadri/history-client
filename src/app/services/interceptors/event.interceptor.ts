import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

import { Event } from '../../models/events/event';
import {TimelineEvent} from '../../models/timelines/timeline-event';
import {EventTimeline} from '../../models/events/event-timeline';

@Injectable()
export class EventInterceptor implements HttpInterceptor {
  private body = {
    events: [],
    total: 0,
    links: {}
  };

  private events: Event[] = [];
  private event: Event;

  private eventTimeline: EventTimeline;
  private eventTimelines: EventTimeline[] = [];

  private timelineEvent: TimelineEvent;
  private timelineEvents: TimelineEvent[] = [];

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
      if (req.headers.get('type')) {
        if (req.headers.get('type') === 'events') {
          this.events = [];

          for (const data of event.body.data) {
            this.event = new Event();
            this.event.initializeNewEvent();
            this.event.mapEvent(data);

            this.events.push(this.event);
          }

          this.body.events = this.events;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;
        } else if (req.headers.get('type') === 'event') {
          this.event = new Event();
          this.event.initializeNewEvent();
          this.event.mapEvent(event.body.data);

          event.body = this.event;
        } else if ((req.headers.get('type') === 'event_timelines')) {
          for (const data of event.body.data) {
            this.eventTimeline = new EventTimeline();
            this.eventTimeline.initializeNewEventTimeline();
            this.eventTimeline.mapEventTimeline(data);

            this.eventTimelines.push(this.eventTimeline);
          }

          let body = {
            eventTimelines: [],
            total: 0,
            links: {}
          };

          body.eventTimelines = this.eventTimelines;
          body.total = event.body.meta.count;
          body.links = event.body.links;

          event.body = body;

        } else if ((req.headers.get('type') === 'timeline_events')) {
          for (const data of event.body.data) {
            this.timelineEvent = new TimelineEvent();
            this.timelineEvent.initializeNewTimelineEvent();
            this.timelineEvent.mapTimelineEvent(data);

            this.timelineEvents.push(this.timelineEvent);
          }

          let body = {
            timelineEvents: [],
            total: 0,
            links: {}
          };

          body.timelineEvents = this.timelineEvents;
          body.total = event.body.meta.count;
          body.links = event.body.links;

          event.body = body;

        }
      }
    }
  }
}
