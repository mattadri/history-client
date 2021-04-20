import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';

import { Observable } from 'rxjs';

import {User} from '../../models/user';

@Injectable()
export class UserInterceptor implements HttpInterceptor {
  private users: User[];
  private user: User;

  private body = {
    users: [],
    total: 0,
    links: {}
  };

  constructor() {
    this.users = [];
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
        if (req.headers.get('type') === 'users') {
          this.users = [];

          for (const data of event.body.data) {
            this.user = new User();
            this.user.initializeNewUser();
            this.user.mapUser(data);

            this.users.push(this.user);
          }

          this.body.users = this.users;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if ((req.headers.get('type') === 'user')) {
          this.user = new User();
          this.user.initializeNewUser();
          this.user.mapUser(event.body.data);

          event.body = this.user;
        }
      }
    }
  }
}
