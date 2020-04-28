import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  constructor(private http: HttpClient) { }
  getMonths(): Observable<any> {
    return this.http.get<any>('api/months', {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
