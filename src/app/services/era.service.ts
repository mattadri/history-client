import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EraService {
  constructor(private http: HttpClient) { }
  getEras(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/eras', {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
