import {ChartOptions, TitleOptions} from '../chart-options';
export class ChartTitleOptionsPost {
  data: any;

  mapToPost(chartOptions: ChartOptions, titleOptions: TitleOptions, isPatch: boolean) {
    this.data = {
      type: 'chart_title_options',
      attributes: {
        display: titleOptions.display,
        text: titleOptions.text,
        position: titleOptions.position,
        padding: titleOptions.padding,
        line_height: titleOptions.lineHeight,
        font_size: titleOptions.fontSize,
        font_family: titleOptions.fontFamily,
        font_style: titleOptions.fontStyle,
        font_color: titleOptions.fontColor,

        chart_options_rel: {
          data: {
            type: 'chart_options',
            id: chartOptions.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = titleOptions.id;
    }
  }
}
