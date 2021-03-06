import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor } from '@angular/common/http';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import {tap} from 'rxjs/internal/operators';

import { Observable } from 'rxjs';

import {Chart} from '../../models/chart';

@Injectable()
export class ChartInterceptor implements HttpInterceptor {
  private charts: Chart[];
  private chart: Chart;

  private body = {
    charts: [],
    total: 0,
    links: {}
  };

  constructor() {
    this.charts = [];
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
        if (req.headers.get('type') === 'charts') {
          this.charts = [];

          for (const data of event.body.data) {
            this.chart = new Chart();
            this.chart.initializeNewChart();
            this.chart.mapChart(data);

            this.charts.push(this.chart);
          }

          this.body.charts = this.charts;
          this.body.total = event.body.meta.count;
          this.body.links = event.body.links;

          event.body = this.body;

        } else if ((req.headers.get('type') === 'chart')) {
          this.chart = new Chart();
          this.chart.initializeNewChart();
          this.chart.mapChart(event.body.data);

          event.body = this.chart;
        }
      }
    }
  }
}
