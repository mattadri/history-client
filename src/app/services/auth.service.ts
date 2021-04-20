import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Auth} from '../models/auth';
import {Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userToken: string;

  constructor(private http: HttpClient) { }

  checkAuth(auth: Auth): Observable<any> {
    return this.http.post(environment.apiUrl + '/login', auth, {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json').set('Content-Type', 'application/vnd.api+json')
    });
  }

  getApiMasterUser(): Promise<any> {
    return this.http.get<any>(environment.apiUrl + '/auth?page[size]=1&page[number]=1&fields[auth]=token', {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
    }).toPromise();
  }

  static logOut(): void {
    localStorage.setItem('isLoggedIn', 'false');

    localStorage.removeItem('user.id');
    localStorage.removeItem('user.firstName');
    localStorage.removeItem('user.lastName');
  }

  setToken(token) {
    this.userToken = token;
  }

  getToken() {
    return this.userToken;
  }
}
