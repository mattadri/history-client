import {ChartType} from '../enums/chart-types';
import {ChartLabel} from './chart-label';
import {ChartDataset} from './chart-dataset';
import {ChartOptions} from './chart-options';

export class Chart {
  id: number;

  title: string;
  type: ChartType;

  labels: ChartLabel[];
  datasets: ChartDataset[];

  options: ChartOptions;

  initializeNewChart() {
    this.title = 'New Chart';
    this.type = ChartType.LINE;

    this.labels = [];
    this.datasets = [];

    const initialLabel = new ChartLabel();
    initialLabel.initializeNewChartLabel();

    this.labels.push(initialLabel);
    this.labels.push(initialLabel);

    const initialDataset = new ChartDataset();
    initialDataset.initializeNewDataset();

    this.datasets.push(initialDataset);

    this.options = new ChartOptions();
    this.options.initializeNewOptions();
  }

  mapChart(chart: any) {
    this.id = chart.id;

    this.title = chart.attributes.title;

    if (chart.attributes.type === ChartType.LINE) {
      this.type = ChartType.LINE;
    } else if (chart.attributes.type === ChartType.BAR) {
      this.type = ChartType.BAR;
    } else if (chart.attributes.type === ChartType.HORIZONTAL_BAR) {
      this.type = ChartType.HORIZONTAL_BAR;
    } else if (chart.attributes.type === ChartType.PIE) {
      this.type = ChartType.PIE;
    } else if (chart.attributes.type === ChartType.DOUGHNUT) {
      this.type = ChartType.DOUGHNUT;
    } else if (chart.attributes.type === ChartType.POLAR_AREA) {
      this.type = ChartType.POLAR_AREA;
    } else if (chart.attributes.type === ChartType.RADAR) {
      this.type = ChartType.RADAR;
    }

    if (chart.attributes.chart_label && chart.attributes.chart_label.data.length) {
      this.labels = [];

      for (const chartLabel of chart.attributes.chart_label.data) {
        const newChartLabel = new ChartLabel();
        newChartLabel.initializeNewChartLabel();
        newChartLabel.mapChartLabel(chartLabel);

        newChartLabel.label = chartLabel.attributes.label;

        this.labels.push(newChartLabel);
      }
    }

    if (chart.attributes.chart_dataset && chart.attributes.chart_dataset.data.length) {
      this.datasets = [];

      for (const dataset of chart.attributes.chart_dataset.data) {
        const newDataset = new ChartDataset();
        newDataset.initializeNewDataset();
        newDataset.mapDataSet(dataset);

        this.datasets.push(newDataset);
      }
    }

    if (chart.attributes.chart_options && chart.attributes.chart_options.data.length) {
      const options = new ChartOptions();
      options.initializeNewOptions();

      options.mapOptions(chart.attributes.chart_options.data[0]);

      this.options = options;
    }
  }
}
