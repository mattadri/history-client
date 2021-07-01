import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { PersonPost } from '../models/persons/posts/person-post';
import { Person } from '../models/persons/person';
import { PersonNote } from '../models/persons/person-note';
import { PersonNotePost } from '../models/persons/posts/person-note-post';
import {PersonBiographiesResponse, PersonResponse, PersonTimelinesResponse} from '../models/responses/person-response';
import {PersonBiography} from '../models/persons/person-biography';
import {PersonBiographyPost} from '../models/persons/posts/person-biography-post';
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

  getApiPersons(path,
                pageSize: string,
                pageNumber: string,
                include: Array<string>,
                fields: Array<string>,
                sort: Array<string>,
                sortDescending: boolean,
                additionalFilters: Array<Object>,
                isAnotherPage: boolean): Observable<PersonResponse> {
    let type = 'persons';

    // if a next or previous page is being retrieved just leave the path as is
    if (!isAnotherPage) {
      if (!path) {
        path = '/persons';
      }

      // default page size is 20 records per page
      if (!pageSize) {
        pageSize = '20';
      }

      // default page number to 1
      if (!pageNumber) {
        pageNumber = '1';
      }

      let filter = [];

      path = path + '?page[size]=' + pageSize;

      path = path + '&page[number]=' + pageNumber;

      // include any related objects
      if (include && include.length) {
        path = path + '&include=';

        for (let i = 0; i < include.length; i++) {
          path = path + include[i];

          if (i < include.length - 1) {
            path = path + ',';
          }
        }
      }

      // add any fields filter to the path
      if (fields && fields.length) {
        path = path + '&fields[person]=';

        for (let i = 0; i < fields.length; i++) {
          path = path + fields[i];

          if (i < fields.length - 1) {
            path = path + ',';
          }
        }
      }

      // add any sorting if requested
      if (sort && sort.length) {
        path = path + '&sort=';

        if (sortDescending) {
          path = path + '-';
        }

        for (let i = 0; i < sort.length; i++) {
          path = path + sort[i];

          if (i < sort.length - 1) {
            path = path + ',';
          }
        }
      }

      // lastly tack on any additional filters passed
      if (additionalFilters && additionalFilters.length) {
        for (const additionalFilter of additionalFilters) {
          filter.push(additionalFilter);
        }
      }

      if (filter.length) {
        path = path + '&filter=' + JSON.stringify(filter);
      }
    }

    return this.http.get<PersonResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
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

    let path = '/person_timelines';

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

    path = path + '&include=timeline_rel&fields[timeline]=id,label';

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

    path = path + '&include=essay_rel&fields[essay]=id,title';

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

  createPersonBiography(personBiography: PersonBiography, person: Person): Observable<any> {
    this.personBiographyPost = new PersonBiographyPost();
    this.personBiographyPost.mapToPersonBiographyPost(personBiography, person);

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

  getPerson(personId: string) {
    for (let i = 0; i < this.persons.length; i++) {
      if (this.persons[i].id.toString() === personId.toString()) {
        return this.persons[i];
      }
    }
  }

  getPersons() {
    return this.persons;
  }
}
