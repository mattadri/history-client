import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Chart} from '../../models/chart';
import {ChartService} from '../../services/chart.service';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-chart-dialog',
  templateUrl: './add-chart-dialog.component.html',
  styleUrls: ['./add-chart-dialog.component.scss']
})
export class AddChartDialogComponent implements OnInit {
  public charts: Chart[];
  public chart: Chart;

  public searchCharts: Chart[] = [];

  public chartNameAutocompleteControl = new FormControl();
  public chartNameFilteredOptions: Observable<Chart[]>;

  constructor(private chartService: ChartService,
              public dialogRef: MatDialogRef<AddChartDialogComponent>) {

    this.chart = new Chart();
    this.chart.initializeNewChart();

    this.chartService.getApiCharts('/charts?page[size]=0').subscribe(response => {

      this.searchCharts = response.charts;

      this.chartNameFilteredOptions = this.chartNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(chart => this._filterChartsName(chart))
      );
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChartTitle(value) {
    if (value) {
      this.chart.options.title.text = value;
    } else {
      this.chart.options.title.text = this.chartNameAutocompleteControl.value;
    }
  }

  saveNewChart() {
    this.dialogRef.close(this.chart);
  }

  private _filterChartsName(filterValue: any): Chart[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchCharts.filter(chart => {
        if (chart.options.title.text) {
          return chart.options.title.text.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('chart_title').focus();
  }
}
