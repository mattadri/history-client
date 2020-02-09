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
      if (req.headers.headers.get('type')) {
        if (req.headers.headers.get('type')[0] === 'authors') {
          this.authors = [];

          for (const data of event.body.data) {
            this.author = new Author();
            this.author.mapAuthor(data, false);

            this.authors.push(this.author);
          }

          event.body = this.authors;
        }
      }
    }
  }
}
