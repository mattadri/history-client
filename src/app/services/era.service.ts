import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../environments/environment';
import {Era} from '../models/era';

@Injectable({
  providedIn: 'root'
})

export class EraService {
  private eras: Era[];

  constructor(private http: HttpClient) {
    this.eras = [];
  }

  getCachedEras() {
    return this.eras;
  }

  setEra(era: Era) {
    this.eras.push(era);
  }

  getEra(eraId: string) {
    for (let i = 0; i < this.eras.length; i++) {
      if (this.eras[i].id.toString() === eraId) {
        return this.eras[i];
      }
    }
  }

  getEras(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/eras', {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
