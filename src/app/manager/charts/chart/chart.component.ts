import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {MatDialog} from '@angular/material';

import {Subject} from 'rxjs';

import { Chart } from '../../../models/chart';

import {ChartService} from '../../../services/chart.service';
import {ChartLabel} from '../../../models/chart-label';
import {ChartDatasetData} from '../../../models/chart-dataset-data';
import {ChartDataset} from '../../../models/chart-dataset';

import {ConfirmRemovalComponent} from '../../../utilities/confirm-removal/confirm-removal.component';

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
  constructor(private route: ActivatedRoute,
              private navigation: Router,
              private chartService: ChartService,
              public dialog: MatDialog) {
    const chartId = this.route.snapshot.paramMap.get('id');

    this.chartService.getApiChart(chartId).subscribe(chart => {
      this.chart = chart;

      this.chart.labels.sort(this.sortById);

      for (const dataset of this.chart.datasets) {
        dataset.data.sort(this.sortById);
      }

      this.chartService.setChart(chart);
    });

    this.chartScreenSize = 'fullscreen_exit';
  }

  ngOnInit() { }

  private sortById(a, b) {
    if (a.id > b.id) {
      return 1;
    } else {
      return -1
    }
  }

  removeChart() {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the chart '
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.chartService.deleteApiChart(this.chart.id).subscribe(() => {
          this.navigation.navigateByUrl('/manager/charts').then();
        });
      }
    });
  }

  updateChartType() {
    this.chartService.patchApiChart(this.chart).subscribe(() => {
      this.updateChartNotifier.next(true);
    });
  }

  addChartLabel() {
    const newChartLabel: ChartLabel = new ChartLabel();

    newChartLabel.initializeNewChartLabel();

    this.chartService.createApiChartLabel(this.chart, newChartLabel).subscribe((newLabelResponse) => {
      newChartLabel.id = newLabelResponse.data.id;

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
    const dataset = new ChartDataset();
    dataset.initializeNewDataset();

    dataset.data = [];

    this.chartService.createApiChartDataset(this.chart, dataset).subscribe(newDatasetResponse => {
      dataset.id = newDatasetResponse.data.id;

      this.chart.labels.forEach(() => {
        const datasetData = new ChartDatasetData();
        datasetData.initializeNewDatasetData();

        this.chartService.createApiChartDatasetData(dataset, datasetData).subscribe((newDataResponse) => {
          datasetData.id = newDataResponse.data.id;
        });

        dataset.data.push(datasetData);
      });

      this.chart.datasets.push(dataset);

      this.callUpdateChart();
    });
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
