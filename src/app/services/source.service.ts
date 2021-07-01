import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Source } from '../models/source';
import { Author } from '../models/author';
import { SourcePost } from '../models/posts/source-post';
import { SourceAuthorPost } from '../models/posts/source-author-post';
import {SourceNote} from '../models/source-note';
import {SourceNotePost} from '../models/posts/source-note-post';
import {SourceResponse} from '../models/responses/source-response';
import {SourceNoteBrainstormPost} from '../models/posts/source-note-brainstorm-post';
import {Brainstorm} from '../models/brainstorm';

@Injectable({
  providedIn: 'root'
})
export class SourceService {
  private sourcePost: SourcePost;
  private sourceAuthorPost: SourceAuthorPost;
  private notePost: SourceNotePost;
  private noteBrainstormPost: SourceNoteBrainstormPost;

  private sources: Source[];
  private source: Source;

  constructor(private http: HttpClient) {
    this.sources = [];
  }

  static removeNote(source: Source, note: SourceNote) {
    for (let i = 0; i < source.notes.length; i++) {
      if (source.notes[i].id === note.id) {
        source.notes.splice(i, 1);
      }
    }
  }

  getSources() {
    return this.sources;
  }

  getSource(sourceId: string) {
    for (const source of this.sources) {
      if (source.id.toString() === sourceId.toString()) {
        return source;
      }
    }
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

  getApiSources(path,
                pageSize: string,
                pageNumber: string,
                include: Array<string>,
                fields: Array<string>,
                sort: Array<string>,
                sortDescending: boolean,
                additionalFilters: Array<Object>,
                isAnotherPage: boolean): Observable<SourceResponse> {
    let type = 'sources';

    // if a next or previous page is being retrieved just leave the path as is
    if (!isAnotherPage) {
      if (!path) {
        path = '/references';
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
        path = path + '&fields[reference]=';

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

    return this.http.get<SourceResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
    });
  }

  getApiSource(sourceId: string): Observable<Source> {
    return this.http.get<Source>(environment.apiUrl + '/references/' + sourceId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'source')
    });
  }

  createApiSource(source: Source): Observable<any> {
    this.sourcePost = new SourcePost();
    this.sourcePost.mapToPost(source, false);

    return this.http.post(environment.apiUrl + '/references', this.sourcePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiSource(source: Source): Observable<any> {
    this.sourcePost = new SourcePost();
    this.sourcePost.mapToPost(source, true);

    return this.http.patch(environment.apiUrl + '/references/' + source.id, this.sourcePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiSourceAuthor(source: Source, author: Author): Observable<any> {
    this.sourceAuthorPost = new SourceAuthorPost();
    this.sourceAuthorPost.mapToPost(source, author);

    return this.http.post(environment.apiUrl + '/reference_authors', this.sourceAuthorPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiSource(source: Source): Observable<any> {
    return this.http.delete(environment.apiUrl + '/references/' + source.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiSourceAuthor(author: Author): Observable<any> {
    return this.http.delete(environment.apiUrl + '/reference_authors/' + author.relationshipId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  createApiSourceNote(note: SourceNote, source: Source): Observable<any> {
    this.notePost = new SourceNotePost();
    this.notePost.mapToPost(note, source, false);

    return this.http.post(environment.apiUrl + '/reference_notes', this.notePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiSourceNote(source: Source, note: SourceNote): Observable<any> {
    this.notePost = new SourceNotePost();
    this.notePost.mapToPost(note, source, true);

    return this.http.patch(environment.apiUrl + '/reference_notes/' + note.id, this.notePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiSourceNoteBrainstorm(note: SourceNote, brainstorm: Brainstorm): Observable<any> {
    this.noteBrainstormPost = new SourceNoteBrainstormPost();
    this.noteBrainstormPost.mapToPost(note, brainstorm, false);

    return this.http.post(environment.apiUrl + '/reference_note_export_brainstorm_destinations', this.noteBrainstormPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }


  removeApiNote(note: SourceNote): Observable<any> {
    return this.http.delete(environment.apiUrl + '/reference_notes/' + note.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
