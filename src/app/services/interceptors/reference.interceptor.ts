import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { HttpHandler, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

import { Reference } from '../../models/reference';

@Injectable()
export class ReferenceInterceptor implements HttpInterceptor {
  private body = {
    references: [],
    total: 0,
    links: {}
  };

  private references: Reference[] = [];
  private reference: Reference;

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
        if (req.headers.headers.get('type')[0] === 'references') {
          this.references = [];

          for (const data of event.body.data) {
            this.reference = new Reference();
            this.reference.mapReference(data);

            this.references.push(this.reference);
          }

          this.body.references = this.references;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;
        }
      }
    }
  }
}
