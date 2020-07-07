import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Author } from '../models/author';
import { AuthorPost } from '../models/posts/author-post';
import {AuthorResponse} from '../models/responses/author-response';

@Injectable({
  providedIn: 'root'
})

export class AuthorService {
  private authors: Author[];
  private authorPost: AuthorPost;

  constructor(private http: HttpClient) {
    this.resetAuthors();
  }

  resetAuthors() {
    this.authors = [];
  }

  getAuthors() {
    return this.authors;
  }

  setAuthor(author: Author) {
    this.authors.push(author);
  }

  removeAuthor(author: Author) {
    for (let i = 0; i < this.authors.length; i++) {
      if (this.authors[i].id === author.id) {
        this.authors.splice(i, 1);
      }
    }
  }

  getApiAuthors(path): Observable<AuthorResponse> {
    this.authors = [];

    if (!path) {
      path = '/authors';
    }

    return this.http.get<AuthorResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'authors')
    });
  }

  getApiAuthor(authorId): Observable<Author> {
    return this.http.get<Author>(environment.apiUrl + '/authors/' + authorId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'person')
    });
  }

  removeApiAuthor(author: Author): Observable<any> {
    return this.http.delete(environment.apiUrl + '/authors/' + author.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  createApiAuthor(author: Author): Observable<any> {
    this.authorPost = new AuthorPost();
    this.authorPost.mapToPost(author, false);

    return this.http.post(environment.apiUrl + '/authors', this.authorPost, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json').set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiAuthor(author: Author): Observable<any> {
    this.authorPost = new AuthorPost();
    this.authorPost.mapToPost(author, true);

    return this.http.patch(environment.apiUrl + '/authors/' + author.id, this.authorPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }
}
