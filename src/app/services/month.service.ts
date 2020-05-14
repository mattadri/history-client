import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  constructor(private http: HttpClient) { }
  getMonths(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/months', {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
