import {ChartDataset} from '../chart-dataset';
import {ChartDatasetData} from '../chart-dataset-data';
export class ChartDatasetDataPost {
  data: any;

  mapToPost(chartDataset: ChartDataset, datasetData: ChartDatasetData, isPatch: boolean) {
    this.data = {
      type: 'chart_dataset_data',
      attributes: {
        x_data: datasetData.xData,

        chart_dataset_rel: {
          data: {
            type: 'chart_dataset',
            id: chartDataset.id
          }
        }
      }
    };

    if (datasetData.yData) {
      this.data.attributes.y_data = datasetData.yData;
    }

    if (datasetData.rData) {
      this.data.attributes.r_data = datasetData.rData;
    }

    if (isPatch) {
      this.data.id = datasetData.id;
    }
  }
}
