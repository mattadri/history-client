import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';

import { Observable } from 'rxjs';

import {Brainstorm} from '../../models/brainstorm';

@Injectable()
export class BrainstormInterceptor implements HttpInterceptor {
  private brainstorms: Brainstorm[];
  private brainstorm: Brainstorm;

  private body = {
    brainstorms: [],
    total: 0,
    links: {}
  };

  constructor() {
    this.brainstorms = [];
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
      if (req.headers.get('type')) {
        if (req.headers.get('type') === 'brainstorms') {
          this.brainstorms = [];

          for (const data of event.body.data) {
            this.brainstorm = new Brainstorm();
            this.brainstorm.initializeNewBrainstorm();
            this.brainstorm.mapBrainstorm(data);

            this.brainstorms.push(this.brainstorm);
          }

          this.body.brainstorms = this.brainstorms;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if (req.headers.get('type') === 'user_brainstorms') {
          this.brainstorms = [];

          for (const data of event.body.data) {
            this.brainstorm = new Brainstorm();
            this.brainstorm.initializeNewBrainstorm();
            this.brainstorm.mapBrainstorm(data.attributes.brainstorm.data);


            this.brainstorms.push(this.brainstorm);
          }

          this.body.brainstorms = this.brainstorms;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if ((req.headers.get('type') === 'brainstorm')) {
          this.brainstorm = new Brainstorm();
          this.brainstorm.initializeNewBrainstorm();
          this.brainstorm.mapBrainstorm(event.body.data);

          event.body = this.brainstorm;
        }
      }
    }
  }
}
