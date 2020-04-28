import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

import { Person } from '../../models/person';

@Injectable()
export class PersonInterceptor implements HttpInterceptor {
  private body = {
    persons: [],
    total: 0,
    links: {}
  };

  private persons: Person[] = [];
  private person: Person;

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
        if (req.headers.get('type') === 'persons') {
          this.persons = [];

          for (const data of event.body.data) {
            this.person = new Person();
            this.person.mapPerson(data);

            this.persons.push(this.person);
          }

          this.body.persons = this.persons;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;
        } else if ((req.headers.get('type') === 'person')) {
          this.person = new Person();
          this.person.mapPerson(event.body.data);

          event.body = this.person;
        }
      }
    }
  }
}
