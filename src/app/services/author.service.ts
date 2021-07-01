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

  getApiAuthors(path,
                pageSize: string,
                pageNumber: string,
                include: Array<string>,
                fields: Array<string>,
                sort: Array<string>,
                sortDescending: boolean,
                additionalFilters: Array<Object>,
                isAnotherPage: boolean): Observable<AuthorResponse> {
    let type = 'authors';

    // if a next or previous page is being retrieved just leave the path as is
    if (!isAnotherPage) {
      if (!path) {
        path = '/authors';
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
        path = path + '&fields[project]=';

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

    return this.http.get<AuthorResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', type)
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
