import {Component, Input, OnInit, OnDestroy} from '@angular/core';

import {Subject} from 'rxjs';

import { Chart as RenderedChart } from '../../../../../node_modules/chart.js/dist/Chart.js';

import {Chart} from '../../../models/chart';

import {ChartType} from '../../../enums/chart-types';

import {ChartService} from '../../../services/chart.service';

@Component({
  selector: 'app-chart-display',
  templateUrl: './chart-display.component.html',
  styleUrls: ['./chart-display.component.scss']
})
export class ChartDisplayComponent implements OnInit, OnDestroy {
  @Input() notifier: Subject<any>;

  public chartConfig: any;
  public chart: Chart;

  public renderedChart: any;

  constructor(private chartService: ChartService) {
    this.chartConfig = {};
  }

  ngOnInit() {
    this.chart = this.chartService.getChart();

    this.makeChart();

    // listens for request from the parent component to update that chart
    this.notifier.subscribe(doDestroy => this.rerenderChart(doDestroy));
  }

  ngOnDestroy() {
    this.notifier.unsubscribe();
  }

  makeChartConfig() {
    this.chartConfig.type = this.chart.type;
    this.chartConfig.data = {};

    this.chartConfig.data.labels = this.chart.labels;

    this.chartConfig.data.datasets = [];

    if (!this.chartConfig.options) {
      this.chartConfig.options = {};
      this.chartConfig.options.title = {};
    }

    this.chartConfig.options.maintainAspectRatio = this.chart.options.maintainAspectRatio;
    this.chartConfig.options.responsive = this.chart.options.responsive;

    this.chartConfig.options.title = this.chart.options.title;
    this.chartConfig.options.legend = this.chart.options.legend;
    this.chartConfig.options.tooltips = this.chart.options.tooltips;

    this.chartConfig.options.scales = {

    };

    if (!this.chartConfig.data) {
      this.chartConfig.data = {};
      this.chartConfig.datasets = [];
    }

    for (const dataset of this.chart.datasets) {
      this.chartConfig.data.datasets.push(this.mapToChartJSDataset(dataset));
    }

    this.setChartCallbacks();
  }

  mapToChartJSDataset(dataset) {
    let chartJSDataset: object;

    chartJSDataset = {
      label: dataset.label,
      data: Object.keys(dataset.data).map(k => dataset.data[k].xData),
      fill: dataset.fill,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.borderColor,
      pointRadius: dataset.pointRadius,
      pointBackgroundColor: dataset.pointBackgroundColor
    };

    return chartJSDataset;
  }

  makeChart() {
    const context = document.getElementById('chart_canvas');

    this.makeChartConfig();

    this.renderedChart = new RenderedChart(context, this.chartConfig);

    this.rerenderChart(false);
  }

  setChartCallbacks() {
    // The data object for values is of type object instead of String[]. The callback will return value into String[];
    if (this.chartConfig.type === ChartType.LINE || this.chartConfig.type === ChartType.BAR) {
      if (!this.chartConfig.options.scales) {
        this.chartConfig.options.scales = {};
      }

      if (!this.chartConfig.options.scales.xAxes) {
        this.chartConfig.options.scales.xAxes = [{
          ticks: {}
        }];
      }

      this.chartConfig.options.scales.xAxes[0].ticks.callback = (value, index, values) => value.label;

    } else if (this.chartConfig.type === ChartType.HORIZONTAL_BAR) {
      if (!this.chartConfig.options.scales) {
        this.chartConfig.options.scales = {};
      }

      if (!this.chartConfig.options.scales.yAxes) {
        this.chartConfig.options.scales.yAxes = [{
          ticks: {}
        }];
      }

      if (this.chartConfig.options.scales) {
        this.chartConfig.options.scales.yAxes[0].ticks.callback = (value, index, values) => value.label;
      }
    }
  }

  rerenderChart(doDestroy: boolean) {
    this.chart = this.chartService.getChart();

    if (doDestroy) {
      this.chartConfig = {};

      this.renderedChart.destroy();
      this.makeChartConfig();

      const context = document.getElementById('chart_canvas');
      this.renderedChart = new RenderedChart(context, this.chartConfig);

    } else {
      this.makeChartConfig();

      this.renderedChart.update(this.chartConfig);
    }
  }
}
