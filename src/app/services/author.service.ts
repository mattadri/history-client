import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Author } from '../models/author';
import { AuthorPost } from '../models/posts/author-post';

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

  getApiAuthors(path): Observable<Author[]> {
    this.authors = [];

    if (!path) {
      path = '/authors';
    }

    return this.http.get('/api' + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'authors')
    });
  }

  removeApiAuthor(author: Author): Observable<any> {
    return this.http.delete('/api/authors/' + author.id, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }

  createApiAuthor(author: Author) {
    this.authorPost = new AuthorPost();
    this.authorPost.mapToPost(author);

    return this.http.post('/api/authors', this.authorPost, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json').set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiAuthor(author: Author): Observable<Author> {
    this.authorPost = new AuthorPost();
    this.authorPost.mapToPost(author, true);

    return this.http.patch('/api/authors/' + author.id, this.authorPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }
}
