import {Chart} from '../chart';

export class ChartPost {
  data: object;

  mapToPost(chart: Chart, isPatch: boolean) {
    this.data = {
      type: 'chart',
      attributes: {
        title: chart.title,
        type: chart.type
      }
    };

    if (isPatch) {
      this.data.id = chart.id;
    }
  }
}
