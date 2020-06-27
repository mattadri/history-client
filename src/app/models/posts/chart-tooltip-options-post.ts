import {ChartOptions, TooltipOptions} from '../chart-options';

export class ChartTooltipOptionsPost {
  data;

  mapToPost(chartOptions: ChartOptions, tooltipOptions: TooltipOptions, isPatch: boolean) {
    this.data = {
      type: 'chart_tooltip_options',
      attributes: {
        enabled: tooltipOptions.enabled,
        background_color: tooltipOptions.backgroundColor,
        title_font_family: tooltipOptions.titleFontFamily,
        title_font_size: tooltipOptions.titleFontSize,
        title_font_style: tooltipOptions.titleFontStyle,
        title_font_color: tooltipOptions.titleFontColor,
        title_align: tooltipOptions.titleAlign,
        title_spacing: tooltipOptions.titleSpacing,
        title_margin_bottom: tooltipOptions.titleMarginBottom,
        body_font_family: tooltipOptions.bodyFontFamily,
        body_font_size: tooltipOptions.bodyFontSize,
        body_font_style: tooltipOptions.bodyFontStyle,
        body_font_color: tooltipOptions.bodyFontColor,
        body_align: tooltipOptions.bodyAlign,
        body_spacing: tooltipOptions.bodySpacing,
        footer_font_family: tooltipOptions.footerFontFamily,
        footer_font_size: tooltipOptions.footerFontSize,
        footer_font_style: tooltipOptions.footerFontStyle,
        footer_font_color: tooltipOptions.footerFontColor,
        footer_align: tooltipOptions.footerAlign,
        footer_spacing: tooltipOptions.footerSpacing,
        footer_margin_top: tooltipOptions.footerMarginTop,
        x_padding: tooltipOptions.xPadding,
        y_padding: tooltipOptions.yPadding,
        caret_padding: tooltipOptions.caretPadding,
        caret_size: tooltipOptions.caretSize,
        corner_radius: tooltipOptions.cornerRadius,
        display_colors: tooltipOptions.displayColors,
        border_color: tooltipOptions.borderColor,
        border_width: tooltipOptions.borderWidth,

        chart_options_rel: {
          data: {
            type: 'chart_options',
            id: chartOptions.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = tooltipOptions.id;
    }
  }
}
