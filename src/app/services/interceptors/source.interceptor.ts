import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

import { Source } from '../../models/source';

@Injectable()
export class SourceInterceptor implements HttpInterceptor {
  private body = {
    sources: [],
    total: 0,
    links: {}
  };

  private sources: Source[] = [];
  private source: Source;

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
        if (req.headers.get('type') === 'sources') {
          this.sources = [];

          for (const data of event.body.data) {
            this.source = new Source();
            this.source.mapSource(data);

            this.sources.push(this.source);
          }

          this.body.sources = this.sources;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;
        } else if (req.headers.get('type') === 'source') {
          this.source = new Source();
          this.source.initializeSource();
          this.source.mapSource(event.body.data);

          event.body = this.source;
        }
      }
    }
  }
}
