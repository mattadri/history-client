import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {ChartService} from '../../services/chart.service';
import {Chart} from '../../models/chart';
import {AddChartDialogComponent} from '../../utilities/add-chart-dialog/add-chart-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  public charts: Chart[];

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private chartService: ChartService,
              private router: Router,
              public dialog: MatDialog) {
    this.getCharts('/charts');
  }

  ngOnInit() {

  }

  getCharts(path) {
    this.chartService.getApiCharts(path).subscribe((response) => {
      for (const chart of response.charts) {
        this.chartService.setChart(chart);
      }

      this.charts = this.chartService.getCharts();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  createNewChart() {
    const dialogRef = this.dialog.open(AddChartDialogComponent, {
      width: '750px',
      data: {
        showExisting: false,
        showNew: true
      }
    });

    dialogRef.afterClosed().subscribe(chartResponse => {
      if (chartResponse.chart.title) {
        let chart = chartResponse.chart;

        this.chartService.createApiChart(chart).subscribe(response => {
          chart.id = response.data.id;

          for (const label of chart.labels) {
            this.chartService.createApiChartLabel(chart, label).subscribe(labelResponse => {
              label.id = labelResponse.data.id;
            });
          }

          for (const dataset of chart.datasets) {
            this.chartService.createApiChartDataset(chart, dataset).subscribe(datasetResponse => {
              dataset.id = datasetResponse.data.id;

              for (const data of dataset.data) {
                this.chartService.createApiChartDatasetData(dataset, data).subscribe(dataResponse => {
                  data.id = dataResponse.data.id;
                });
              }
            });
          }

          this.chartService.createApiChartOptions(chart, chart.options).subscribe(optionsResponse => {
            chart.options.id = optionsResponse.data.id;

            // make the title options
            this.chartService.createApiChartTitleOptions(chart.options, chart.options.title).subscribe(titleOptionsResponse => {
              chart.options.title.id = titleOptionsResponse.data.id;
            });

            // make the legend options
            this.chartService.createApiChartLegendOptions(chart.options, chart.options.legend).subscribe(legendOptionsResponse => {
              chart.options.legend.id = legendOptionsResponse.data.id;

              this.chartService.createApiChartLegendLabelOptions(chart.options.legend, chart.options.legend.labels)
                .subscribe(legendLabelOptionsResponse => {
                  chart.options.legend.labels.id = legendLabelOptionsResponse.data.id;
                });
            });

            // make the tooltip options
            this.chartService.createApiChartTooltipOptions(chart.options, chart.options.tooltips).subscribe(tooltipOptionsResponse => {
              chart.options.tooltips.id = tooltipOptionsResponse.data.id;
            });
          });

          this.router.navigate(['/manager/charts', response.data.id]).then();
        });
      }
    });
  }

  turnPage(chart) {
    if (chart.pageIndex < chart.previousPageIndex) {
      this.getCharts(this.previousPage);
    } else if (chart.pageIndex > chart.previousPageIndex) {
      this.getCharts(this.nextPage);
    }
  }
}
