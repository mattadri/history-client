import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';

import { Observable } from 'rxjs';

import { Author } from '../../models/author';

@Injectable()
export class AuthorInterceptor implements HttpInterceptor {
  private authors: Author[];
  private author: Author;

  private body = {
    authors: [],
    total: 0,
    links: {}
  };

  constructor() {
    this.authors = [];
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(evt => {
        this.handleResponse(req, evt);
      })
    );
  }

  handleResponse(req: HttpRequest<any>, event) {
    if (event.body) {
      if (req.headers.get('type')) {
        if (req.headers.get('type') === 'authors') {
          this.authors = [];

          for (const data of event.body.data) {
            this.author = new Author();
            this.author.mapAuthor(data, null);

            this.authors.push(this.author);
          }

          this.body.authors = this.authors;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if ((req.headers.get('type') === 'author')) {
          this.author = new Author();
          this.author.initializeAuthor();
          this.author.mapAuthor(event.body.data, null);

          event.body = this.author;
        }
      }
    }
  }
}
