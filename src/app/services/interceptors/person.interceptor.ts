import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';

import { Person } from '../../models/persons/person';
import {PersonTimeline} from '../../models/persons/person-timeline';
import {PersonBiography} from '../../models/persons/person-biography';

@Injectable()
export class PersonInterceptor implements HttpInterceptor {
  private body = {
    persons: [],
    total: 0,
    links: {}
  };

  private persons: Person[] = [];
  private person: Person;

  private personTimelines: PersonTimeline[] = [];
  private personTimeline: PersonTimeline;

  private personBiographies: PersonBiography[] = [];
  private personBiography: PersonBiography;

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
            this.person.initializeNewPerson();
            this.person.mapPerson(data);

            this.persons.push(this.person);
          }

          this.body.persons = this.persons;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if ((req.headers.get('type') === 'person')) {
          this.person = new Person();
          this.person.initializeNewPerson();
          this.person.mapPerson(event.body.data);

          event.body = this.person;

        } else if ((req.headers.get('type') === 'person_timelines')) {
          for (const data of event.body.data) {
            this.personTimeline = new PersonTimeline();
            this.personTimeline.initializeNewPersonTimeline();
            this.personTimeline.mapPersonTimeline(data, event.body.included);

            this.personTimelines.push(this.personTimeline);
          }

          let body = {
            personTimelines: [],
            total: 0,
            links: {}
          };

          body.personTimelines = this.personTimelines;
          body.total = event.body.meta.count;
          body.links = event.body.links;

          event.body = body;

        } else if ((req.headers.get('type') === 'person_biographies')) {

          for (const data of event.body.data) {
            this.personBiography = new PersonBiography();
            this.personBiography.initializeNewBiography();
            this.personBiography.mapBiography(data, event.body.included);

            this.personBiographies.push(this.personBiography);
          }

          let body = {
            personBiographies: [],
            total: 0,
            links: {}
          };

          body.personBiographies = this.personBiographies;
          body.total = event.body.meta.count;
          body.links = event.body.links;

          event.body = body;
        }
      }
    }
  }
}
