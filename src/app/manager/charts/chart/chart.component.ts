import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Subject} from 'rxjs';

import { Chart } from '../../../models/chart';

import {ChartService} from '../../../services/chart.service';
import {ChartLabel} from '../../../models/chart-label';
import {ChartDataset} from '../../../models/chart-dataset';
import {ChartDatasetData} from '../../../models/chart-dataset-data';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  public chart: Chart;

  public chartScreenSize: string;

  public updateChartNotifier: Subject<any> = new Subject<any>();

  /* ***
    OF NOTE: THERE IS THE ACTUAL ANGULAR CHART OBJECT USED TO RETRIEVE, UPDATE, CREATE AND DELETE CHARTS ON
    THE API SIDE. THEN THERE IS THE CHARTDATA OBJECT THAT REPRESENTS THE OBJECT FORM REQUIRED BY CHARTJS IN
    ORDER TO RENDER THE CHART ITSELF. ALL BINDING IS DONE WITH THE ANGULAR CHART OBJECT AND MAPPED TO THE
    CHARTJS OBJECT.
  *** */
  constructor(private route: ActivatedRoute, private chartService: ChartService) {
    const chartId = this.route.snapshot.paramMap.get('id');

    this.chartService.getApiChart(chartId).subscribe(chart => {
      this.chart = chart;

      this.chartService.setChart(chart);
    });

    this.chartScreenSize = 'fullscreen_exit';
  }

  ngOnInit() { }

  updateChartType() {
    this.chartService.patchApiChart(this.chart).subscribe(() => {
      this.updateChartNotifier.next(true);
    });
  }

  addChartLabel() {
    const newChartLabel: ChartLabel = new ChartLabel();

    newChartLabel.initializeNewChartLabel();

    this.chartService.createApiChartLabel(this.chart, newChartLabel).subscribe((newLabelResponse) => {
      newChartLabel.id = newLabelResponse.id;

      this.chart.labels.push(newChartLabel);

      for (const dataset of this.chart.datasets) {
        const newDatasetData = new ChartDatasetData();
        newDatasetData.initializeNewDatasetData();
        newDatasetData.xData = dataset.data.length;

        dataset.data.push(newDatasetData);

        this.chartService.createApiChartDatasetData(dataset, newDatasetData).subscribe((datasetDataResponse => {
          newDatasetData.id = datasetDataResponse.id;
        }));
      }

      this.callUpdateChart();
    });
  }

  addDataset() {
    const dataset = {
      label: 'New Dataset',
      data: []
    };

    this.chart.labels.forEach(() => {
      dataset.data.push({value: 1});
    });

    this.chart.datasets.push(dataset);

    this.updateDatasets();
  }

  updateChartLabel(label) {
    this.chartService.patchApiChartLabel(this.chart, label).subscribe(() => {
      this.callUpdateChart();
    });
  }

  updateDataset(dataset) {
    this.chartService.patchApiChartDataset(this.chart, dataset).subscribe(() => {
      this.callUpdateChart();
    });
  }

  updateDatasetData(dataset, data) {
    this.chartService.patchApiChartDatasetData(dataset, data).subscribe(() => {
      this.callUpdateChart();
    });
  }

  updateTitleOptions() {
    this.chartService.patchApiChartTitleOptions(this.chart.options, this.chart.options.title).subscribe(() => {
      this.callUpdateChart();
    });
  }

  updateTooltipOptions() {
    this.chartService.patchApiChartTooltipOptions(this.chart.options, this.chart.options.tooltips).subscribe(() => {
      this.callUpdateChart();
    });
  }

  updateLegendOptions() {
    this.chartService.patchApiChartLegendOptions(this.chart.options, this.chart.options.legend).subscribe(() => {
      this.callUpdateChart();
    });
  }

  updateLegendLabelOptions() {
    this.chartService.patchApiChartLegendLabelOptions(this.chart.options.legend, this.chart.options.legend.labels).subscribe(() => {
      this.callUpdateChart();
    });
  }

  callUpdateChart() {
    this.chartService.setChart(this.chart);

    this.updateChartNotifier.next();
  }

  toggleContentPanel(contentPanel) {
    if (contentPanel.opened) {
      this.chartScreenSize = 'fullscreen_exit';
      contentPanel.close();
    } else {
      this.chartScreenSize = 'fullscreen';
      contentPanel.open();
    }
  }

  trackByData(index) {
    return index;
  }
}
