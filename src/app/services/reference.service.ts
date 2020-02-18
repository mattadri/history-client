import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reference } from '../models/reference';
import { Author } from '../models/author';
import { ReferencePost } from '../models/posts/reference-post';
import { ReferenceAuthorPost } from '../models/posts/reference-author-post';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {
  private referencePost: ReferencePost;
  private referenceAuthorPost: ReferenceAuthorPost;

  private references: Reference[];

  constructor(private http: HttpClient) {
    this.references = [];
  }

  getReferences() {
    return this.references;
  }

  setReference(reference: Reference) {
    this.references.push(reference);
  }

  removeReference(reference: Reference) {
    for (let i = 0; i < this.references.length; i++) {
      if (this.references[i].id === reference.id) {
        this.references.splice(i, 1);
      }
    }
  }

  removeAuthor(reference: Reference, author: Author) {
    for (const loopedReference of this.references) {
      if (loopedReference.id === reference.id) {
        for (let j = 0; j < loopedReference.authors.length; j++) {
          if (loopedReference.authors[j].id === author.id) {
            loopedReference.authors.splice(j, 1);
          }
        }
      }
    }
  }

  getApiReferences(path): Observable<Reference[]> {
    this.references = [];

    if (!path) {
      path = '/references';
    }

    return this.http.get<Reference[]>('api' + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'references')
    });
  }

  createApiReference(reference: Reference): Observable<any> {
    this.referencePost = new ReferencePost();
    this.referencePost.mapToPost(reference);

    return this.http.post('/api/references', this.referencePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiReference(reference: Reference): Observable<Reference> {
    this.referencePost = new ReferencePost();
    this.referencePost.mapToPost(reference, true);

    return this.http.patch('/api/references/' + reference.id, this.referencePost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiReferenceAuthor(reference: Reference, author: Author): Observable<any> {
    this.referenceAuthorPost = new ReferenceAuthorPost();
    this.referenceAuthorPost.mapToPost(reference, author);

    return this.http.post('/api/reference_authors', this.referenceAuthorPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  removeApiReference(reference: Reference): Observable<any> {
    return this.http.delete('/api/references/' + reference.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  removeApiReferenceAuthor(author: Author): Observable<any> {
    return this.http.delete('/api/reference_authors/' + author.relationshipId, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
