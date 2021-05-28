import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

import { Timeline } from '../../models/timelines/timeline';

@Injectable()
export class TimelineInterceptor implements HttpInterceptor {
  private body = {
    timelines: [],
    total: 0,
    links: {}
  };

  private timelines: Timeline[] = [];
  private timeline: Timeline;

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
        if (req.headers.get('type') === 'timelines') {
          this.timelines = [];

          for (const data of event.body.data) {
            this.timeline = new Timeline();
            this.timeline.initializeNewTimeline();
            this.timeline.mapTimeline(data);

            this.timelines.push(this.timeline);
          }

          this.body.timelines = this.timelines;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if (req.headers.get('type') === 'user_timelines') {
          this.timelines = [];

          for (const data of event.body.data) {
            this.timeline = new Timeline();
            this.timeline.initializeNewTimeline();
            this.timeline.mapTimeline(data.attributes.timeline.data);



            this.timelines.push(this.timeline);
          }

          this.body.timelines = this.timelines;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if (req.headers.get('type') === 'timeline') {
          this.timeline = new Timeline();
          this.timeline.initializeNewTimeline();
          this.timeline.mapTimeline(event.body.data);

          event.body = this.timeline;
        }
      }
    }
  }
}
