import {Component, Inject, OnInit} from '@angular/core';

import {Chart} from '../../models/chart';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';

export interface DialogData {
  chart: Chart;
}

@Component({
  selector: 'app-essay-chart-details',
  templateUrl: './essay-chart-details.component.html',
  styleUrls: ['./essay-chart-details.component.scss']
})
export class EssayChartDetailsComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: DialogData) { }

  ngOnInit() {
  }

}
