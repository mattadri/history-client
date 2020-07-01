import {ChartOptions, LegendOptions} from '../chart-options';

export class ChartLegendOptionsPost {
  data: any;

  mapToPost(chartOptions: ChartOptions, legendOptions: LegendOptions, isPatch: boolean) {
    this.data = {
      type: 'chart_legend_options',
      attributes: {
        display: legendOptions.display,
        position: legendOptions.position,
        align: legendOptions.align,
        full_width: legendOptions.fullWidth,
        reverse: legendOptions.reverse,

        chart_options_rel: {
          data: {
            type: 'chart_options',
            id: chartOptions.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = legendOptions.id;
    }
  }
}
