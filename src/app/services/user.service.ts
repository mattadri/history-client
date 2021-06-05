import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import {User} from '../models/user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserResponse} from '../models/users/responses/user-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public users: User[];
  public user: User;

  public previousPage: string;

  constructor(private http: HttpClient) {
    this.users = [];
  }

  getApiUsers(path): Observable<UserResponse> {
    this.users = [];

    if (!path) {
      path = '/users';
    }

    return this.http.get<UserResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'users')
    });
  }

  setUser(user: User) {
    this.users.push(user);
  }

  setSingleUser(user: User) {
    this.user = user;
  }

  getUsers() {
    return this.users;
  }

  getUser() {
    return this.user;
  }

  setPreviousPage(previousPage: string) {
    this.previousPage = previousPage;
  }

  getPreviousPage(): string {
    return this.previousPage;
  }

  getLoggedInUser() {
    let loggedInUser = new User();
    loggedInUser.initializeNewUser();

    loggedInUser.id = localStorage.getItem('user.id');
    loggedInUser.firstName = localStorage.getItem('user.firstName');
    loggedInUser.lastName = localStorage.getItem('user.lastName');

    return loggedInUser;
  }
}
