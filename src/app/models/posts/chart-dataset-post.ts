import {ChartDataset} from '../chart-dataset';
import {Chart} from '../chart';
export class ChartDatasetPost {
  data: any;

  mapToPost(chart: Chart, chartDataset: ChartDataset, isPatch: boolean) {
    this.data = {
      type: 'chart_dataset',
      attributes: {
        label: chartDataset.label,
        fill: chartDataset.fill,
        background_color: chartDataset.backgroundColor,
        border_color: chartDataset.borderColor,
        point_radius: chartDataset.pointRadius,
        point_background_color: chartDataset.pointBackgroundColor,

        chart_rel: {
          data: {
            type: 'chart',
            id: chart.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = chartDataset.id;
    }
  }
}
