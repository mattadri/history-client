import { Component, OnInit } from '@angular/core';
import {Chart} from '../../models/chart';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {ChartService} from '../../services/chart.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-existing-chart-dialog',
  templateUrl: './add-existing-chart-dialog.component.html',
  styleUrls: ['./add-existing-chart-dialog.component.scss']
})
export class AddExistingChartDialogComponent implements OnInit {
  public charts: Chart[];
  public chart: Chart;

  public searchCharts: Chart[] = [];

  public chartNameAutocompleteControl = new FormControl();
  public chartNameFilteredOptions: Observable<Chart[]>;

  constructor(private chartService: ChartService,
              public dialogRef: MatDialogRef<AddExistingChartDialogComponent>) {

    this.chart = new Chart();
    this.chart.initializeNewChart();

    this.chartService.getApiCharts(null, '0', null, null, null, null, false, null, false).subscribe(response => {

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

  saveExistingChart(chart) {
    this.dialogRef.close(chart);
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
