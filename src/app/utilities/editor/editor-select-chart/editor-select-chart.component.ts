import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {MatDialogRef} from '@angular/material';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Chart} from '../../../models/chart';

import {ChartService} from '../../../services/chart.service';

@Component({
  selector: 'app-editor-select-chart',
  templateUrl: './editor-select-chart.component.html',
  styleUrls: ['./editor-select-chart.component.scss']
})
export class EditorSelectChartComponent implements OnInit {
  public charts: Chart[];

  public responseObject: any;

  public loadAutoComplete: boolean;

  public chartsAutocompleteControl = new FormControl();
  public chartsFilteredOptions: Observable<Chart[]>;
  public chartFieldDisplayValue: string;

  constructor(public dialogRef: MatDialogRef<EditorSelectChartComponent>, private chartService: ChartService) {
    this.responseObject = {
      chart: null
    };

    this.loadAutoComplete = false;

    this.chartService.getApiCharts('/charts?page[size]=0').subscribe(charts => {
      for (const chart of charts.charts) {
        this.chartService.setChart(chart);
      }

      this.charts = this.chartService.getCharts();

      this.chartsFilteredOptions = this.chartsAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(chart => this._filterCharts(chart))
      );

      this.loadAutoComplete = true;
    });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveChart() {
    this.responseObject.chart = this.chartsAutocompleteControl.value;
  }

  displayChart(chart: Chart) {
    if (chart) {
      this.chartFieldDisplayValue = chart.options.title.text;
    }

    return this.chartFieldDisplayValue;
  }

  private _filterCharts(filterValue: any): Chart[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.charts.filter(chart => {
        return chart.options.title.text.toLowerCase().includes(filterValue);
      });
    }
  }
}
