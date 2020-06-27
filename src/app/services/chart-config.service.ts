import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigService {
  public chartConfig: any;

  constructor() { }

  getChartConfig() {
    return this.chartConfig;
  }

  setChartConfig(config) {
    this.chartConfig = config;
  }
}
