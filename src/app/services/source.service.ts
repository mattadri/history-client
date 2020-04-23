import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Source } from '../models/source';
import { Author } from '../models/author';
import { SourcePost } from '../models/posts/source-post';
import { SourceAuthorPost } from '../models/posts/source-author-post';
import {SourceNote} from '../models/source-note';
import {SourceNotePost} from '../models/posts/source-note-post';

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private sourcePost: SourcePost;
  private sourceAuthorPost: SourceAuthorPost;

  private sources: Source[];
  private source: Source;

  constructor(private http: HttpClient) {
    this.sources = [];
  }

  getSources() {
    return this.sources;
  }

  setSource(source: Source) {
    this.sources.push(source);
  }

  removeSource(source: Source) {
    for (let i = 0; i < this.sources.length; i++) {
      if (this.sources[i].id === source.id) {
        this.sources.splice(i, 1);
      }
    }
  }

  removeAuthor(source: Source, author: Author) {
    for (const loopedSource of this.sources) {
      if (loopedSource.id === source.id) {
        for (let j = 0; j < loopedSource.authors.length; j++) {
          if (loopedSource.authors[j].id === author.id) {
            loopedSource.authors.splice(j, 1);
          }
        }
      }
    }
  }

  removeNote(source: Source, note: SourceNote) {
    for (let i = 0; i < source.notes.length; i++) {
      if (source.notes[i].id === note.id) {
        source.notes.splice(i, 1);
      }
    }
  }

  getApiSources(path): Observable<Source[]> {
    this.sources = [];

    if (!path) {
      path = '/references';
    }

    return this.http.get<Source[]>('api' + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'sources')
    });
  }

  getApiSource(sourceId): Observable<Source> {
    return this.http.get<Source>('api/references/' + sourceId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'source')
    });
  }

  createApiSource(source: Source): Observable<any> {
    this.sourcePost = new SourcePost();
    this.sourcePost.mapToPost(source);

    return this.http.post('/api/references', this.sourcePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiSource(source: Source): Observable<Source> {
    this.sourcePost = new SourcePost();
    this.sourcePost.mapToPost(source, true);

    return this.http.patch('/api/references/' + source.id, this.sourcePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiSourceAuthor(source: Source, author: Author): Observable<any> {
    this.sourceAuthorPost = new SourceAuthorPost();
    this.sourceAuthorPost.mapToPost(source, author);

    return this.http.post('/api/reference_authors', this.sourceAuthorPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiSource(source: Source): Observable<any> {
    return this.http.delete('/api/references/' + source.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiSourceAuthor(author: Author): Observable<any> {
    return this.http.delete('/api/reference_authors/' + author.relationshipId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  createApiSourceNote(note: SourceNote, source: Source): Observable<any> {
    console.log('Note: ', note);
    this.notePost = new SourceNotePost();
    this.notePost.mapToPost(note, source);

    return this.http.post('/api/reference_notes', this.notePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiNote(note: SourceNote): Observable<any> {
    return this.http.delete('/api/reference_notes/' + note.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
