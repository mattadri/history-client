import {ChartLabel} from '../chart-label';
import {Chart} from '../chart';

export class ChartLabelPost {
  data: object;

  mapToPost(chart: Chart, chartLabel: ChartLabel, isPatch: boolean) {
    this.data = {
      type: 'chart_label',
      attributes: {
        label: chartLabel.label,

        chart_rel: {
          data: {
            type: 'chart',
            id: chart.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = chartLabel.id;
    }
  }
}
