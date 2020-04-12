import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { PersonPost } from '../models/posts/person-post';
import { Person } from '../models/person';
import { PersonNote } from '../models/person-note';
import { PersonNotePost } from '../models/posts/person-note-post';

@Injectable({
  providedIn: 'root'
})

export class PersonService {
  private personPost: PersonPost;
  private personNotePost: PersonNotePost;
  private persons: Person[];

  constructor(private http: HttpClient) { }

  createApiPerson(person: Person): Observable<Person> {
    this.personPost = new PersonPost();
    this.personPost.mapToPost(person);

    return this.http.post('/api/persons', this.personPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiPerson(person: Person): Observable<Person> {
    this.personPost = new PersonPost();
    this.personPost.mapToPost(person, true);

    return this.http.patch('/api/persons/' + person.id, this.personPost, {
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

  getApiPersons(path): Observable<Person[]> {
    this.persons = [];

    if (!path) {
      path = '/persons';
    }

    return this.http.get<Person[]>('api' + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'persons')
    });
  }

  createApiPersonNote(note: PersonNote, person: Person): Observable<any> {
    this.personNotePost = new PersonNotePost();
    this.personNotePost.mapToNotePost(note, person);

    return this.http.post('/api/person_notes', this.personNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiNote(note: PersonNote): Observable<any> {
    return this.http.delete('/api/person_notes/' + note.id, {
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

  removePersonNote(person: Person, note: PersonNote) {
    for (let i = 0; i < person.notes.length; i++) {
      if (person.notes[i].id === note.id) {
        person.notes.splice(i, 1);
      }
    }
  }

  setPerson(person: Person) {
    this.persons.push(person);
  }

  getPersons() {
    return this.persons;
  }
}
