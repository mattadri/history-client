import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { PersonPost } from '../models/posts/person-post';
import { Person } from '../models/persons/person';
import { PersonNote } from '../models/persons/person-note';
import { PersonNotePost } from '../models/posts/person-note-post';
import {PersonBiographiesResponse, PersonResponse, PersonTimelinesResponse} from '../models/responses/person-response';
import {PersonBiography} from '../models/persons/person-biography';
import {PersonBiographyPost} from '../models/posts/person-biography-post';
import {PersonTimeline} from '../models/persons/person-timeline';
import {Timeline} from '../models/timelines/timeline';

@Injectable({
  providedIn: 'root'
})

export class PersonService {
  private personPost: PersonPost;
  private personNotePost: PersonNotePost;
  private personBiographyPost: PersonBiographyPost;

  private persons: Person[];
  private personTimelines: PersonTimeline[];
  private personBiographies: PersonBiography[];

  private filterObject: Array<any>;

  constructor(private http: HttpClient) {
    this.persons = [];
  }

  static removePersonNote(person: Person, note: PersonNote) {
    for (let i = 0; i < person.notes.length; i++) {
      if (person.notes[i].id === note.id) {
        person.notes.splice(i, 1);
      }
    }
  }

  createApiPerson(person: Person): Observable<any> {
    this.personPost = new PersonPost();
    this.personPost.mapToPost(person, false);

    return this.http.post(environment.apiUrl + '/persons', this.personPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiPerson(person: Person): Observable<any> {
    this.personPost = new PersonPost();
    this.personPost.mapToPost(person, true);

    return this.http.patch(environment.apiUrl + '/persons/' + person.id, this.personPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiPersonNote(note: PersonNote, person: Person) {
    this.personNotePost = new PersonNotePost();
    this.personNotePost.mapToNotePost(note, person, true);

    return this.http.patch(environment.apiUrl + '/person_notes/' + note.id, this.personNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiPerson(person: Person): Observable<any> {
    return this.http.delete(environment.apiUrl + '/persons/' + person.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiPersonBiography(biography: PersonBiography): Observable<any> {
    return this.http.delete(environment.apiUrl + '/person_biographies/' + biography.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  getApiPersons(path, filterTerm, dateFilter, isPageLink): Observable<PersonResponse> {
    this.filterObject = [];

    this.persons = [];

    // if this is a page link the path is already fully formed. as such skip.
    if (!isPageLink) {
      if (!path) {
        path = '/persons';

        if ((filterTerm) || (!filterTerm && dateFilter)) {
          path = path + '?';
        }
      } else {
        if (filterTerm || dateFilter) {
          path = path + '&';
        }
      }

      if (filterTerm) {
        const searchFilter = {
          or: [
            {
              name: 'description',
              op: 'ilike',
              val: '%' + filterTerm + '%'
            },
            {
              name: 'first_name',
              op: 'ilike',
              val: '%' + filterTerm + '%'
            },
            {
              name: 'last_name',
              op: 'ilike',
              val: '%' + filterTerm + '%'
            }
          ]
        };

        this.filterObject.push(searchFilter);
      }

      if (dateFilter) {
        if (dateFilter.length === 2) {
          const startDateFilter = {
            name: 'birth_year',
            op: 'gt',
            val: dateFilter[0]
          };

          const endDateFilter = {
            name: 'birth_year',
            op: 'lt',
            val: dateFilter[1]
          };

          this.filterObject.push(startDateFilter);
          this.filterObject.push(endDateFilter);
        }
      }

      if (this.filterObject.length) {
        const filterQuery = JSON.stringify(this.filterObject);

        path = path + 'filter=' + filterQuery;
      }
    }

    return this.http.get<PersonResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'persons')
    });
  }

  getApiPerson(personId): Observable<Person> {
    return this.http.get<Person>(environment.apiUrl + '/persons/' + personId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'person')
    });
  }

  getApiPersonTimelines(person: Person): Observable<PersonTimelinesResponse> {
    this.filterObject = [];

    this.personTimelines = [];

    let path = '/timeline_persons';

    const personFilter = {
      name: 'person_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: person.id.toString()
      }
    };

    this.filterObject.push(personFilter);

    const filterQuery = JSON.stringify(this.filterObject);

    path = path + '?filter=' + filterQuery;

    path = path + '&page[size]=0';

    return this.http.get<PersonTimelinesResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'person_timelines')
    });
  }

  getApiTimelinePersons(timeline: Timeline): Observable<PersonTimelinesResponse> {
    this.filterObject = [];

    this.personTimelines = [];

    let path = '/timeline_persons';

    const personFilter = {
      name: 'timeline_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: timeline.id.toString()
      }
    };

    this.filterObject.push(personFilter);

    const filterQuery = JSON.stringify(this.filterObject);

    path = path + '?filter=' + filterQuery;

    path = path + '&page[size]=0';

    return this.http.get<PersonTimelinesResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'person_timelines')
    });
  }

  getApiPersonBiographies(person: Person): Observable<PersonBiographiesResponse> {
    this.filterObject = [];

    this.personBiographies = [];

    let path = '/person_biographies';

    const personFilter = {
      name: 'person_rel',
      op: 'has',
      val: {
        name: 'id',
        op: 'eq',
        val: person.id.toString()
      }
    };

    this.filterObject.push(personFilter);

    const filterQuery = JSON.stringify(this.filterObject);

    path = path + '?filter=' + filterQuery;

    path = path + '&page[size]=0';

    return this.http.get<PersonBiographiesResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'person_biographies')
    });
  }

  createApiPersonImage(imageForm: FormData): Observable<any> {
    return this.http.post(environment.apiUrl + '/upload_person_image', imageForm, {responseType: 'text'});
  }

  createApiPersonNote(note: PersonNote, person: Person): Observable<any> {
    this.personNotePost = new PersonNotePost();
    this.personNotePost.mapToNotePost(note, person, false);

    return this.http.post(environment.apiUrl + '/person_notes', this.personNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createPersonBiography(personBiography: PersonBiography): Observable<any> {
    this.personBiographyPost = new PersonBiographyPost();
    this.personBiographyPost.mapToPersonBiographyPost(personBiography);

    return this.http.post(environment.apiUrl + '/person_biographies', this.personBiographyPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiNote(note: PersonNote): Observable<any> {
    return this.http.delete(environment.apiUrl + '/person_notes/' + note.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removePerson(person: Person) {
    for (let i = 0; i < this.persons.length; i++) {
      if (this.persons[i].id === person.id) {
        this.persons.splice(i, 1);
      }
    }
  }

  removeApiPersonTimeline(personTimeline: PersonTimeline): Observable<any> {
    return this.http.delete(environment.apiUrl + '/timeline_persons/' + personTimeline.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  setPerson(person: Person) {
    this.persons.push(person);
  }

  getPersons() {
    return this.persons;
  }
}
