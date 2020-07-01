import {LegendLabelOptions, LegendOptions} from '../chart-options';
export class ChartLegendLabelOptionsPost {
  data: any;

  mapToPost(chartLegendOptions: LegendOptions, chartLegendLabelOptions: LegendLabelOptions, isPatch: boolean) {
    this.data = {
      type: 'chart_legend_label_options',
      attributes: {
        box_width: chartLegendLabelOptions.boxWidth,
        padding: chartLegendLabelOptions.padding,
        use_point_style: chartLegendLabelOptions.usePointStyle,
        font_size: chartLegendLabelOptions.fontSize,
        font_family: chartLegendLabelOptions.fontFamily,
        font_style: chartLegendLabelOptions.fontStyle,
        font_color: chartLegendLabelOptions.fontColor,

        chart_legend_options_rel: {
          data: {
            type: 'chart_legend_options',
            id: chartLegendOptions.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = chartLegendLabelOptions.id;
    }
  }
}
