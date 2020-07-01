import { Injectable } from '@angular/core';

import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';

import {Chart} from '../models/chart';
import {ChartPost} from '../models/posts/chart-post';
import {ChartResponse} from '../models/responses/chart-response';
import {ChartLabel} from '../models/chart-label';
import {ChartLabelPost} from '../models/posts/chart-label-post';
import {ChartDataset} from '../models/chart-dataset';
import {ChartDatasetPost} from '../models/posts/chart-dataset-post';
import {ChartDatasetData} from '../models/chart-dataset-data';
import {ChartDatasetDataPost} from '../models/posts/chart-dataset-data-post';
import {ChartOptions, LegendLabelOptions, LegendOptions, TitleOptions, TooltipOptions} from '../models/chart-options';
import {ChartTitleOptionsPost} from '../models/posts/chart-title-options-post';
import {ChartOptionsPost} from '../models/posts/chart-options-post';
import {ChartLegendOptionsPost} from '../models/posts/chart-legend-options-post';
import {ChartLegendLabelOptionsPost} from '../models/posts/chart-legend-label-options-post';
import {ChartTooltipOptionsPost} from '../models/posts/chart-tooltip-options-post';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  public chartPost: ChartPost;
  public chartLabelPost: ChartLabelPost;
  public chartDatasetPost: ChartDatasetPost;
  public chartDatasetDataPost: ChartDatasetDataPost;
  public chartOptionsPost: ChartOptionsPost;
  public chartTitleOptionsPost: ChartTitleOptionsPost;
  public chartLegendOptionsPost: ChartLegendOptionsPost;
  public chartLegendLabelOptionsPost: ChartLegendLabelOptionsPost;
  public chartTooltipOptionsPost: ChartTooltipOptionsPost;

  public charts: Chart[];
  public chart: Chart;

  constructor(private http: HttpClient) {
    this.charts = [];
  }

  getApiCharts(path): Observable<ChartResponse> {
    this.charts = [];

    return this.http.get<ChartResponse>(environment.apiUrl + path, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'charts')
    });
  }

  getApiChart(chartId): Observable<Chart> {
    return this.http.get<Chart>(environment.apiUrl + '/charts/' + chartId, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Type', 'chart')
    });
  }

  createApiChart(chart: Chart): Observable<any> {
    this.chartPost = new ChartPost();
    this.chartPost.mapToPost(chart, false);

    return this.http.post(environment.apiUrl + '/charts', this.chartPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartLabel(chart: Chart, chartLabel: ChartLabel): Observable<any> {
    this.chartLabelPost = new ChartLabelPost();
    this.chartLabelPost.mapToPost(chart, chartLabel, false);

    return this.http.post(environment.apiUrl + '/chart_labels', this.chartLabelPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartDataset(chart: Chart, chartDataset: ChartDataset): Observable<any> {
    this.chartDatasetPost = new ChartDatasetPost();
    this.chartDatasetPost.mapToPost(chart, chartDataset, false);

    return this.http.post(environment.apiUrl + '/chart_datasets', this.chartDatasetPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartDatasetData(chartDataset: ChartDataset, datasetData: ChartDatasetData): Observable<any> {
    this.chartDatasetDataPost = new ChartDatasetDataPost();
    this.chartDatasetDataPost.mapToPost(chartDataset, datasetData, false);

    return this.http.post(environment.apiUrl + '/chart_dataset_data', this.chartDatasetDataPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartOptions(chart: Chart, chartOptions: ChartOptions): Observable<any> {
    this.chartOptionsPost = new ChartOptionsPost();
    this.chartOptionsPost.mapToPost(chart, chartOptions, false);

    return this.http.post(environment.apiUrl + '/chart_options', this.chartOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartTitleOptions(chartOptions: ChartOptions, chartTitleOptions: TitleOptions): Observable<any> {
    this.chartTitleOptionsPost = new ChartTitleOptionsPost();
    this.chartTitleOptionsPost.mapToPost(chartOptions, chartTitleOptions, false);

    return this.http.post(environment.apiUrl + '/chart_title_options', this.chartTitleOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartLegendOptions(chartOptions: ChartOptions, chartLegendOptions: LegendOptions): Observable<any> {
    this.chartLegendOptionsPost = new ChartLegendOptionsPost();
    this.chartLegendOptionsPost.mapToPost(chartOptions, chartLegendOptions, false);

    return this.http.post(environment.apiUrl + '/chart_legend_options', this.chartLegendOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartLegendLabelOptions(legendOptions: LegendOptions, chartLegendLabelOptions: LegendLabelOptions): Observable<any> {
    this.chartLegendLabelOptionsPost = new ChartLegendLabelOptionsPost();
    this.chartLegendLabelOptionsPost.mapToPost(legendOptions, chartLegendLabelOptions, false);

    return this.http.post(environment.apiUrl + '/chart_legend_label_options', this.chartLegendLabelOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  createApiChartTooltipOptions(chartOptions: ChartOptions, chartTooltipOptions: TooltipOptions): Observable<any> {
    this.chartTooltipOptionsPost = new ChartTooltipOptionsPost();
    this.chartTooltipOptionsPost.mapToPost(chartOptions, chartTooltipOptions, false);

    return this.http.post(environment.apiUrl + '/chart_tooltip_options', this.chartTooltipOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChart(chart: Chart): Observable<any> {
    this.chartPost = new ChartPost();
    this.chartPost.mapToPost(chart, true);

    return this.http.patch(environment.apiUrl + '/charts/' + chart.id, this.chartPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChartLabel(chart: Chart, chartLabel: ChartLabel): Observable<any> {
    this.chartLabelPost = new ChartLabelPost();
    this.chartLabelPost.mapToPost(chart, chartLabel, true);

    return this.http.patch(environment.apiUrl + '/chart_labels/' + chartLabel.id, this.chartLabelPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChartDataset(chart: Chart, chartDataset: ChartDataset): Observable<any> {
    this.chartDatasetPost = new ChartDatasetPost();
    this.chartDatasetPost.mapToPost(chart, chartDataset, true);

    return this.http.patch(environment.apiUrl + '/chart_datasets/' + chartDataset.id, this.chartDatasetPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChartDatasetData(chartDataset: ChartDataset, datasetData: ChartDatasetData): Observable<any> {
    this.chartDatasetDataPost = new ChartDatasetDataPost();
    this.chartDatasetDataPost.mapToPost(chartDataset, datasetData, true);

    return this.http.patch(environment.apiUrl + '/chart_dataset_data/' + datasetData.id, this.chartDatasetDataPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChartTitleOptions(chartOptions: ChartOptions, chartTitleOptions: TitleOptions): Observable<any> {
    this.chartTitleOptionsPost = new ChartTitleOptionsPost();
    this.chartTitleOptionsPost.mapToPost(chartOptions, chartTitleOptions, true);

    return this.http.patch(environment.apiUrl + '/chart_title_options/' + chartTitleOptions.id, this.chartTitleOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChartTooltipOptions(chartOptions: ChartOptions, chartTooltipOptions: TooltipOptions): Observable<any> {
    this.chartTooltipOptionsPost = new ChartTooltipOptionsPost();
    this.chartTooltipOptionsPost.mapToPost(chartOptions, chartTooltipOptions, true);

    return this.http.patch(environment.apiUrl + '/chart_tooltip_options/' + chartTooltipOptions.id, this.chartTooltipOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChartLegendOptions(chartOptions: ChartOptions, chartLegendOptions: LegendOptions): Observable<any> {
    this.chartLegendOptionsPost = new ChartLegendOptionsPost();
    this.chartLegendOptionsPost.mapToPost(chartOptions, chartLegendOptions, true);

    return this.http.patch(environment.apiUrl + '/chart_legend_options/' + chartLegendOptions.id, this.chartLegendOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  patchApiChartLegendLabelOptions(legendOptions: LegendOptions, chartLegendLabelOptions: LegendLabelOptions): Observable<any> {
    this.chartLegendLabelOptionsPost = new ChartLegendLabelOptionsPost();
    this.chartLegendLabelOptionsPost.mapToPost(legendOptions, chartLegendLabelOptions, true);

    return this.http.patch(
      environment.apiUrl + '/chart_legend_label_options/' + chartLegendLabelOptions.id,
      this.chartLegendLabelOptionsPost, {
      headers: new HttpHeaders()
        .set('Accept', 'application/vnd.api+json')
        .set('Content-Type', 'application/vnd.api+json')
    });
  }

  setChart(chart: Chart) {
    this.charts.push(chart);
    this.chart = chart;
  }

  getCharts() {
    return this.charts;
  }

  getChart() {
    return this.chart;
  }
}
