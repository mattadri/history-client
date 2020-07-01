import {Component, Input, OnInit} from '@angular/core';

import { Chart as RenderedChart } from '../../../../../node_modules/chart.js/dist/Chart.js';

import {Chart} from '../../../models/chart';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit {
  @Input() chart: Chart;

  // public chartData: any;
  // public renderedChart: any;

  constructor() {

  }

  ngOnInit() {
    // this.chartData = {};

    // this.makeChart();
  }

  // makeChart() {
  //   const context = document.getElementById('chart_preview');
  //
  //   this.chartData.type = this.chart.type;
  //   this.chartData.data = {};
  //
  //   this.chartData.data.labels = this.chart.labels;
  //
  //   this.chartData.data.datasets = [];
  //
  //   this.chartData.options = this.chart.options;
  //
  //   for (const dataset of this.chart.datasets) {
  //     this.chartData.data.datasets.push(this.mapToChartJSDataset(dataset));
  //   }
  //
  //   this.renderedChart = new RenderedChart(context, this.chartData);
  // }

  // mapToChartJSDataset(dataset) {
  //   let chartJSDataset: object;
  //
  //   chartJSDataset = {
  //     label: dataset.label,
  //     data: Object.keys(dataset.data).map(k => dataset.data[k].xData),
  //     fill: dataset.fill,
  //     backgroundColor: dataset.backgroundColor,
  //     borderColor: dataset.borderColor,
  //     pointRadius: dataset.pointRadius,
  //     pointBackgroundColor: dataset.pointBackgroundColor
  //   };
  //
  //   return chartJSDataset;
  // }
}
