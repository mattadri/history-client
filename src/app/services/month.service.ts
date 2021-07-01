import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import { environment } from '../../environments/environment';
import {Month} from '../models/month';

@Injectable({
  providedIn: 'root'
})
export class MonthService {
  private months: Month[];

  constructor(private http: HttpClient) {
    this.months = [];
  }

  getCachedMonths() {
    return this.months;
  }

  setMonth(month: Month) {
    this.months.push(month);
  }

  getMonth(monthId: string) {
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i].id.toString() === monthId) {
        return this.months[i];
      }
    }
  }

  getMonths(): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/months', {
      headers: new HttpHeaders().set('Accept', 'application/vnd.api+json')
    });
  }
}
