import {ChartDatasetData} from './chart-dataset-data';

export class ChartDataset {
  id: number;
  label: string;
  data: ChartDatasetData[];
  backgroundColor: string;
  fill: boolean;
  borderColor: string;
  pointRadius: number;
  pointBackgroundColor: string;

  initializeNewDataset() {
    this.label = 'Auto Generated Dataset';
    this.data = [];
    this.backgroundColor = '#d56767';
    this.borderColor = '#6666ff';
    this.fill = false;
    this.pointRadius = 3;
    this.pointBackgroundColor = '#51ff86';

    const initialData = new ChartDatasetData();
    initialData.initializeNewDatasetData();

    this.data.push(initialData);
    this.data.push(initialData);
  }

  mapDataSet(dataset) {
    this.id = dataset.id;
    this.label = dataset.attributes.label;

    if (dataset.attributes.background_color) {
      this.backgroundColor = dataset.attributes.background_color;
    }

    if (dataset.attributes.borderColor) {
      this.borderColor = dataset.attributes.borderColor;
    }

    this.fill = dataset.attributes.fill;

    if (dataset.attributes.point_radius) {
      this.pointRadius = dataset.attributes.point_radius;
    }

    if (dataset.attributes.point_background_color) {
      this.pointBackgroundColor = dataset.attributes.point_background_color;
    }

    if (dataset.attributes.chart_dataset_data && dataset.attributes.chart_dataset_data.data.length) {
      this.data = [];

      for (const datasetData of dataset.attributes.chart_dataset_data.data) {
        const newDatasetData = new ChartDatasetData();
        newDatasetData.initializeNewDatasetData();
        newDatasetData.mapDatasetData(datasetData);

        this.data.push(newDatasetData);
      }
    }
  }
}
