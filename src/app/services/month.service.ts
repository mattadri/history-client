import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of as ObservableOf } from 'rxjs';
import { throwError as ObservableThrow } from 'rxjs';
import { Month } from '../models/month';
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
