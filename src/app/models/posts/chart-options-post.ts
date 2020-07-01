import {ChartOptions} from '../chart-options';
import {Chart} from '../chart';

export class ChartOptionsPost {
  data: any;

  mapToPost(chart: Chart, chartOptions: ChartOptions, isPatch: boolean) {
    this.data = {
      type: 'chart_options',
      attributes: {
        responsive: chartOptions.responsive,
        maintain_aspect_ratio: chartOptions.maintainAspectRatio,

        chart_rel: {
          data: {
            type: 'chart',
            id: chart.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = chartOptions.id;
    }

    console.log('Data: ', this.data);
  }
}
