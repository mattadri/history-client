import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Chart} from '../../models/chart';
import {ChartService} from '../../services/chart.service';
import {Sleep} from '../sleep';

export interface DialogData {
  showExisting: boolean;
  showNew: boolean;
}

class QuickChartReturnData {
  chart: Chart;
  isExisting: boolean;
}

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

  private returnData: QuickChartReturnData;

  constructor(private chartService: ChartService,
              public dialogRef: MatDialogRef<AddChartDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.returnData = new QuickChartReturnData();

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

  saveExistingChart(chart) {
    this.returnData.chart = chart;
    this.returnData.isExisting = true;

    this.dialogRef.close(this.returnData);
  }

  saveNewChart() {
    this.returnData.chart = this.chart;
    this.returnData.isExisting = false;

    this.dialogRef.close(this.returnData);
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

    try {
      document.getElementById('existing_chart_title').focus();
    } catch(e) {
      document.getElementById('new_chart_title').focus();
    }
  }
}
