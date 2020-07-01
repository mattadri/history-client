import {Component, Input, OnInit, OnDestroy, AfterViewInit} from '@angular/core';

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
export class ChartDisplayComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public notifier: Subject<any>;

  // in the case of a static display chart it can just be passed into this component.
  // however, if passing to an edit display than the chart will be retrieved from the service
  @Input() public chart: Chart;

  public chartConfig: any;
  public chartCanvasId: string;

  public renderedChart: any;

  private datasetColors = [
    '#39ab28',
    '#23c28f',
    '#3b99ca',
    '#2b66c4',
    '#554db7',
    '#715ab7',
    '#a53ab7',
    '#b73560',
    '#c40c09',
    '#d5531e',
    '#d48e01',
    '#6fab05',
    '#028014',
    '#009673',
    '#0461a9',
    '#354cb0',
    '#5747b0',
    '#6f2da6',
    '#b74783',
    '#da392f',
    '#ee6e1f',
    '#c39c3b',
  ];

  constructor(private chartService: ChartService) {
    this.chartConfig = {};
  }

  ngOnInit() {
    if (!this.chart) {
      this.chart = this.chartService.getChart();
    }

    this.chartCanvasId = 'chart_canvas_' + this.chart.id;

    // listens for request from the parent component to update that chart
    if (this.notifier) {
      this.notifier.subscribe(doDestroy => this.rerenderChart(doDestroy));
    }
  }

  ngOnDestroy() {
    if (this.notifier) {
      this.notifier.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.makeChart();
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
    let chartJSDataset: any;

    chartJSDataset = {
      label: dataset.label,
      data: Object.keys(dataset.data).map(k => dataset.data[k].xData),
      fill: dataset.fill,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.borderColor,
      pointRadius: dataset.pointRadius,
      pointBackgroundColor: dataset.pointBackgroundColor
    };

    if (this.chart.type === ChartType.PIE || this.chart.type === ChartType.DOUGHNUT) {
      chartJSDataset.backgroundColor = [];

      this.chart.labels.forEach(() => {
        chartJSDataset.backgroundColor.push(this.datasetColors.pop());
      });
    }

    return chartJSDataset;
  }

  makeChart() {
    const context = document.getElementById(this.chartCanvasId);

    this.makeChartConfig();

    this.renderedChart = new RenderedChart(context, this.chartConfig);
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
    } else if (this.chartConfig.type === ChartType.PIE || this.chartConfig.type === ChartType.DOUGHNUT) {
      this.chartConfig.options.legend.labels.generateLabels = (chart) => {
        const data = chart.data;

        const theHelp = RenderedChart.helpers;

        if (data.labels.length && data.datasets.length) {
          return data.labels.map((label, i) => {
            const meta = chart.getDatasetMeta(0);
            const ds = data.datasets[0];
            const arc = meta.data[i];
            const custom = arc && arc.custom || {};
            const getValueAtIndexOrDefault = theHelp.getValueAtIndexOrDefault;
            const arcOpts = chart.options.elements.arc;
            const fill = custom.backgroundColor ? custom.backgroundColor :
              getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor);
            const stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor);
            const bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth);

            return {
              // And finally :
              text: label.label,
              fillStyle: fill,
              strokeStyle: stroke,
              lineWidth: bw,
              hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
              index: i
            };
          });
        }
      };

      this.chartConfig.options.tooltips.callbacks = {};
      this.chartConfig.options.tooltips.callbacks.label = (tooltipItem, data) => {
        const dataValue = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
        const labelValue = data.labels[tooltipItem.index].label

        return labelValue + ': ' + dataValue;
      };
    }
  }

  rerenderChart(doDestroy: boolean) {
    this.chart = this.chartService.getChart();

    if (doDestroy) {
      this.chartConfig = {};

      this.renderedChart.destroy();
      this.makeChartConfig();

      const context = document.getElementById(this.chartCanvasId);
      this.renderedChart = new RenderedChart(context, this.chartConfig);

    } else {
      this.makeChartConfig();

      this.renderedChart.update(this.chartConfig);
    }
  }
}
