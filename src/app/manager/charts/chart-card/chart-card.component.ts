import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Chart} from '../../../models/chart';

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent implements OnInit {
  @Input() chart: Chart;
  @Input() public canDelete: boolean;

  @Output() private removeChart: EventEmitter<Chart>;

  constructor() {
    this.removeChart = new EventEmitter<Chart>();
  }

  ngOnInit() { }

  doRemoveChart() {
    this.removeChart.emit(this.chart);
  }
}
