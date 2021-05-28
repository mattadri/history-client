import {Chart} from '../chart';
export class ProjectChart {
  id: number;

  chart: Chart;

  mapProjectChart(projectChart) {
    this.id = projectChart.id;

    this.chart = new Chart();
    this.chart.initializeNewChart();
    this.chart.mapChart(projectChart.attributes.chart.data);
  }

  initializeNewProjectChart() {
    this.chart = new Chart();
  }
}
