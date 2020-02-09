import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { PersonPost } from '../models/posts/person-post';
import { Person } from '../models/person';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private personPost: PersonPost;
  private persons: Person[];

  constructor(private http: HttpClient) { }

  getPersons() {
    return this.persons;
  }

  setPerson(person: Person) {
    this.persons.push(person);
  }

  removePerson(person: Person) {
    for (let i = 0; i < this.persons.length; i++) {
      if (this.persons[i].id === person.id) {
        this.persons.splice(i, 1);
      }
    }
  }

  getApiPersons(): Observable<Person[]> {
    this.persons = [];

    return this.http.get<Person[]>('api/persons', {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'persons')
    });
  }

  createApiPerson(person: Person): Observable<any> {
    this.personPost = new PersonPost();
    this.personPost.mapToPost(person);

    return this.http.post('/api/persons', this.personPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiPerson(person: Person): Observable<any> {
    return this.http.delete('/api/persons/' + person.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
