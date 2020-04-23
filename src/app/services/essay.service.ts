import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import {Essay} from '../models/essay';
import {EssayPost} from '../models/posts/essay-post';
import {EssayNote} from '../models/essay-note';
import {EssayNotePost} from '../models/posts/essay-note-post';
import {EssayReference} from '../models/essay-reference';
import {EssayReferencePost} from '../models/posts/essay-reference-post';
import {EssayEvent} from '../models/essay-event';
import {EssayEventPost} from '../models/posts/essay-event-post';

@Injectable({
  providedIn: 'root'
})
export class EssayService {
  public essays: Essay[];

  public essayPost: EssayPost;
  public essayNotePost: EssayNotePost;
  public essayReferencePost: EssayReferencePost;
  public essayEventPost: EssayEventPost;

  constructor(private http: HttpClient) {
    this.essays = [];
  }

  getApiEssays(path) {
    this.essays = [];

    return this.http.get<Essay[]>('api' + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'essays')
    });
  }

  getApiEssay(essayId) {
    return this.http.get<Essay[]>('api/essays/' + essayId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'essay')
    });
  }

  createApiEssay(essay: Essay): Observable<Essay> {
    this.essayPost = new EssayPost();
    this.essayPost.mapToPost(essay, true);

    return this.http.post('/api/essays', this.essayPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayNote(essay: Essay, essayNote: EssayNote) {
    this.essayNotePost = new EssayNotePost();
    this.essayNotePost.mapToPost(essay, essayNote);

    return this.http.post('/api/essay_notes', this.essayNotePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayReference(essay: Essay, essayReference: EssayReference) {
    this.essayReferencePost = new EssayReferencePost();
    this.essayReferencePost.mapToPost(essay, essayReference);

    return this.http.post('/api/essay_references', this.essayReferencePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiEssayEvent(essay: Essay, essayEvent: EssayEvent) {
    this.essayEventPost = new EssayEventPost();
    this.essayEventPost.mapToPost(essay, essayEvent);

    return this.http.post('/api/essay_events', this.essayEventPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiEssay(essay: Essay): Observable<Essay> {
    this.essayPost = new EssayPost();
    this.essayPost.mapToPost(essay, true);

    return this.http.patch('/api/essays/' + essay.id, this.essayPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiEssayNote(essayNoteId: number): Observable<any> {
    return this.http.delete('/api/essay_notes/' + essayNoteId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  setEssay(essay: Essay) {
    this.essays.push(essay);
  }

  getEssay(essayId: number) {
    for (const essay of this.essays) {
      if (essay.id === essayId) {
        return essay;
      }
    }
  }

  removeEssay(essay: Essay) {
    for (let i = 0; i < this.essays.length; i++) {
      if (this.essays[i].id === essay.id) {
        this.essays.splice(i, 1);
      }
    }
  }

  removeEssayNote(essay: Essay, essayNote: EssayNote) {
    for (let i = 0; i < essay.essayNotes.length; i++) {
      if (essay.essayNotes[i].id === essayNote.id) {
        essay.essayNotes.splice(i, 1);
      }
    }
  }

  getEssays() {
    return this.essays;
  }
}
