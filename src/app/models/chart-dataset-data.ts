export class ChartDatasetData {
  id: number;

  xData: number;
  yData: number;
  rData: number;

  color: string;
  label: string;

  initializeNewDatasetData() {
    this.xData = 1;
    this.yData = 1;
    this.rData = 1;

    this.color = '#232bc4';
    this.label = 'Temp Label';
  }

  mapDatasetData(datasetData) {
    this.id = datasetData.id;

    if (datasetData.attributes.x_data) {
      this.xData = datasetData.attributes.x_data;
    }

    if (datasetData.attributes.y_data) {
      this.yData = datasetData.attributes.y_data;
    }

    if (datasetData.attributes.r_data) {
      this.rData = datasetData.attributes.r_data;
    }
  }
}
