import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';

import { Observable } from 'rxjs';

import { Essay } from '../../models/essay';

@Injectable()
export class EssayInterceptor implements HttpInterceptor {
  private essays: Essay[];
  private essay: Essay;

  private body = {
    essays: [],
    total: 0,
    links: {}
  };

  constructor() {
    this.essays = [];
  }

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
        if (req.headers.headers.get('type')[0] === 'essays') {
          this.essays = [];

          for (const data of event.body.data) {
            this.essay = new Essay();
            this.essay.mapEssay(data);

            this.essays.push(this.essay);
          }

          this.body.essays = this.essays;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;
        } else if ((req.headers.headers.get('type')[0] === 'essay')) {
          this.essay = new Essay();
          this.essay.initializeNewEssay();

          this.essay.mapEssay(event.body.data);

          event.body = this.essay;
        }
      }
    }
  }
}
