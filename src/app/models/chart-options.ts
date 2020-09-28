import {ChartTitlePositions} from '../enums/chart-title-positions';
import {ChartFontFamilies} from '../enums/chart-font-families';
import {ChartLegendAlignments} from '../enums/legend-alignments';

export class LegendLabelOptions {
  id: number;

  boxWidth: number;
  padding: number;
  usePointStyle: boolean;
  fontSize: number;
  fontStyle: string;
  fontColor: string;
  fontFamily: string;
  // generateLabels: any;

  initializeNewLegendLabelOptions() {
    this.padding = 10;
    this.boxWidth = 40;
    this.usePointStyle = false;
    this.fontSize = 12;
    this.fontStyle = 'normal';
    this.fontColor = '#000000';
    this.fontFamily = '\'Helvetica Neue\', \'Helvetica\', \'Arial\', \'sans-serif\'';
    // this.generateLabels = null;
  }

  mapLegendLabelOptions(legendLabelOptions) {
    this.id = legendLabelOptions.id;

    if (legendLabelOptions.attributes.padding) {
      this.padding = legendLabelOptions.attributes.padding;
    }

    if (legendLabelOptions.attributes.box_width) {
      this.boxWidth = legendLabelOptions.attributes.box_width;
    }

    this.usePointStyle = legendLabelOptions.attributes.use_point_style;

    if (legendLabelOptions.attributes.font_size) {
      this.fontSize = legendLabelOptions.attributes.font_size;
    }

    if (legendLabelOptions.attributes.font_style) {
      this.fontStyle = legendLabelOptions.attributes.font_style;
    }

    if (legendLabelOptions.attributes.font_color) {
      this.fontColor = legendLabelOptions.attributes.font_color;
    }

    if (legendLabelOptions.attributes.font_family) {}
    this.fontFamily = legendLabelOptions.attributes.font_family;
  }
}

export class LegendOptions {
  id: number;

  display: boolean;
  position: ChartTitlePositions;
  align: ChartLegendAlignments;
  fullWidth: boolean;
  reverse: boolean;

  labels: LegendLabelOptions;

  initializeNewLegendOptions() {
    this.display = true;
    this.position = ChartTitlePositions.TOP;
    this.align = ChartLegendAlignments.CENTER;
    this.fullWidth = true;
    this.reverse = false;

    this.labels = new LegendLabelOptions();
    this.labels.initializeNewLegendLabelOptions();
  }

  mapLegendOptions(legendOptions) {
    this.id = legendOptions.id;

    this.display = legendOptions.attributes.display;

    if (legendOptions.attributes.position) {
      this.position = legendOptions.attributes.position;
    }

    if (legendOptions.attributes.align) {
      this.align = legendOptions.attributes.align;
    }

    this.fullWidth = legendOptions.attributes.full_width;

    this.reverse = legendOptions.attributes.reverse;

    if (legendOptions.attributes.chart_legend_label_options && legendOptions.attributes.chart_legend_label_options.data.length) {
      const newLegendLabelOptions = new LegendLabelOptions();
      newLegendLabelOptions.initializeNewLegendLabelOptions();

      newLegendLabelOptions.mapLegendLabelOptions(legendOptions.attributes.chart_legend_label_options.data[0]);

      this.labels = newLegendLabelOptions;
    }
  }
}

export class TooltipOptions {
  id: number;

  enabled: boolean;
  backgroundColor: string;
  titleFontFamily: string;
  titleFontSize: number;
  titleFontStyle: string;
  titleFontColor: string;
  titleAlign: string;
  titleSpacing: number;
  titleMarginBottom: number;
  bodyFontFamily: string;
  bodyFontSize: number;
  bodyFontStyle: string;
  bodyFontColor: string;
  bodyAlign: string;
  bodySpacing: number;
  footerFontFamily: string;
  footerFontSize: number;
  footerFontStyle: string;
  footerFontColor: string;
  footerAlign: string;
  footerSpacing: number;
  footerMarginTop: number;
  xPadding: number;
  yPadding: number;
  caretPadding: number;
  caretSize: number;
  cornerRadius: number;
  displayColors: boolean;
  borderColor: string;
  borderWidth: number;

  initializeNewTooltipOptions() {
    this.enabled = true;
    this.backgroundColor = '#d9dedb';
    this.titleFontFamily = '\'Helvetica Neue\', \'Helvetica\', \'Arial\', \'sans-serif\'';
    this.titleFontSize = 12;
    this.titleFontStyle = 'bold';
    this.titleFontColor = '#fff';
    this.titleAlign = 'left';
    this.titleSpacing = 2;
    this.titleMarginBottom = 6;
    this.bodyFontFamily = '\'Helvetica Neue\', \'Helvetica\', \'Arial\', \'sans-serif\'';
    this.bodyFontSize = 12;
    this.bodyFontStyle = 'normal';
    this.bodyFontColor = '#fff';
    this.bodyAlign = 'left';
    this.bodySpacing = 2;
    this.footerFontFamily = '\'Helvetica Neue\', \'Helvetica\', \'Arial\', \'sans-serif\'';
    this.footerFontSize = 12;
    this.footerFontStyle = 'bold';
    this.footerFontColor = '#fff';
    this.footerAlign = 'left';
    this.footerSpacing = 2;
    this.footerMarginTop = 6;
    this.xPadding = 6;
    this.yPadding = 6;
    this.caretPadding = 2;
    this.caretSize = 5;
    this.cornerRadius = 6;
    this.displayColors = true;
    this.borderColor = '#d9dedb';
    this.borderWidth = 0;
  }

  mapTooltipOptions(tooltipOptions) {
    this.id = tooltipOptions.id;

    this.enabled = tooltipOptions.attributes.enabled;

    if (tooltipOptions.attributes.background_color) {
      this.backgroundColor = tooltipOptions.attributes.background_color;
    }

    if (tooltipOptions.attributes.title_font_family) {
      this.titleFontFamily = tooltipOptions.attributes.title_font_family;
    }

    if (tooltipOptions.attributes.title_font_size) {
      this.titleFontSize = tooltipOptions.attributes.title_font_size;
    }

    if (tooltipOptions.attributes.title_font_style) {
      this.titleFontStyle = tooltipOptions.attributes.title_font_style;
    }

    if (tooltipOptions.attributes.title_font_color) {
      this.titleFontColor = tooltipOptions.attributes.title_font_color;
    }

    if (tooltipOptions.attributes.title_align) {
      this.titleAlign = tooltipOptions.attributes.title_align;
    }

    if (tooltipOptions.attributes.title_spacing) {
      this.titleSpacing = tooltipOptions.attributes.title_spacing;
    }

    if (tooltipOptions.attributes.title_margin_bottom) {
      this.titleMarginBottom = tooltipOptions.attributes.title_margin_bottom;
    }

    if (tooltipOptions.attributes.body_font_family) {
      this.bodyFontFamily = tooltipOptions.attributes.body_font_family;
    }

    if (tooltipOptions.attributes.body_font_size) {
      this.bodyFontSize = tooltipOptions.attributes.body_font_size;
    }

    if (tooltipOptions.attributes.body_font_style) {
      this.bodyFontStyle = tooltipOptions.attributes.body_font_style;
    }

    if (tooltipOptions.attributes.body_font_color) {
      this.bodyFontColor = tooltipOptions.attributes.body_font_color;
    }

    if (tooltipOptions.attributes.body_align) {
      this.bodyAlign = tooltipOptions.attributes.body_align;
    }

    if (tooltipOptions.attributes.body_spacing) {
      this.bodySpacing = tooltipOptions.attributes.body_spacing;
    }

    if (tooltipOptions.attributes.footer_font_family) {
      this.footerFontFamily = tooltipOptions.attributes.footer_font_family;
    }

    if (tooltipOptions.attributes.footer_font_size) {
      this.footerFontSize = tooltipOptions.attributes.footer_font_size;
    }

    if (tooltipOptions.attributes.footer_font_style) {
      this.footerFontStyle = tooltipOptions.attributes.footer_font_style;
    }

    if (tooltipOptions.attributes.footer_font_color) {
      this.footerFontColor = tooltipOptions.attributes.footer_font_color;
    }

    if (tooltipOptions.attributes.footer_align) {
      this.footerAlign = tooltipOptions.attributes.footer_align;
    }

    if (tooltipOptions.attributes.footer_spacing) {
      this.footerSpacing = tooltipOptions.attributes.footer_spacing;
    }

    if (tooltipOptions.attributes.footer_margin_top) {
      this.footerMarginTop = tooltipOptions.attributes.footer_margin_top;
    }

    if (tooltipOptions.attributes.x_padding) {
      this.xPadding = tooltipOptions.attributes.x_padding;
    }

    if (tooltipOptions.attributes.y_padding) {
      this.yPadding = tooltipOptions.attributes.y_padding;
    }

    if (tooltipOptions.attributes.caret_padding) {
      this.caretPadding = tooltipOptions.attributes.caret_padding;
    }

    if (tooltipOptions.attributes.caret_size) {
      this.caretSize = tooltipOptions.attributes.caret_size;
    }

    if (tooltipOptions.attributes.corner_radius) {
      this.cornerRadius = tooltipOptions.attributes.corner_radius;
    }

    this.displayColors = tooltipOptions.attributes.display_colors;

    if (tooltipOptions.attributes.border_width) {
      this.borderWidth = tooltipOptions.attributes.border_width;
    }

    if (tooltipOptions.attributes.border_color) {
      this.borderColor = tooltipOptions.attributes.border_color;
    }
  }
}

export class TitleOptions {
  id: number;

  display: boolean;
  text: string;
  position: ChartTitlePositions;
  fontSize: number;
  fontFamily: ChartFontFamilies;
  fontColor: string;
  fontStyle: string;
  padding: number;
  lineHeight: string;

  initializeNewTitleOptions() {
    this.display = true;
    this.text = 'New Chart';
    this.position = ChartTitlePositions.TOP;
    this.fontSize = 26;
    this.fontFamily = ChartFontFamilies.DEFAULT;
    this.fontColor = '#000000';
    this.fontStyle = 'bold';
    this.padding = 20;
    this.lineHeight = '2.1';
  }

  mapTitleOptions(titleOptions) {
    this.id = titleOptions.id;

    this.display = titleOptions.attributes.display;

    if (titleOptions.attributes.text) {
      this.text = titleOptions.attributes.text;
    }

    if (titleOptions.attributes.position) {
      this.position = titleOptions.attributes.position;
    }

    if (titleOptions.attributes.font_size) {
      this.fontSize = titleOptions.attributes.font_size;
    }

    if (titleOptions.attributes.font_family) {
      this.fontFamily = titleOptions.attributes.font_family;
    }

    if (titleOptions.attributes.font_color) {
      this.fontColor = titleOptions.attributes.font_color;
    }

    if (titleOptions.attributes.font_style) {
      this.fontStyle = titleOptions.attributes.font_style;
    }

    if (titleOptions.attributes.padding) {
      this.padding = titleOptions.attributes.padding;
    }

    if (titleOptions.attributes.line_height) {
      this.lineHeight = titleOptions.attributes.line_height;
    }
  }
}

export class TickOptions {
  beginAtZero: boolean;
  callback: any;

  initializeNewTickOptions() {
    this.beginAtZero = false;
    this.callback = (value, index, values) => value;
  }
}

export class AxesOptions {
  display: boolean;
  ticks: TickOptions;

  initializeNewAxesOptions() {
    this.display = true;
    this.ticks = new TickOptions();

    this.ticks.initializeNewTickOptions();
  }
}

export class ScalesOptions {
  xAxes: AxesOptions[];
  yAxes: AxesOptions[];

  initializeNewScalesOptions() {
    this.xAxes = [];
    this.yAxes = [];

    const xAxesOptions = new AxesOptions();
    xAxesOptions.initializeNewAxesOptions();

    this.xAxes.push(xAxesOptions);

    const yAxesOptions = new AxesOptions();
    yAxesOptions.initializeNewAxesOptions();

    this.yAxes.push(yAxesOptions);
  }
}

export class ChartOptions {
  id: number;
  responsive: boolean;
  maintainAspectRatio: boolean;

  title: TitleOptions;
  legend: LegendOptions;
  tooltips: TooltipOptions;

  scales: ScalesOptions;

  initializeNewOptions() {
    this.responsive = true;
    this.maintainAspectRatio = true;

    this.title = new TitleOptions();
    this.title.initializeNewTitleOptions();

    this.legend = new LegendOptions();
    this.legend.initializeNewLegendOptions();

    this.tooltips = new TooltipOptions();
    this.tooltips.initializeNewTooltipOptions();

    this.scales = new ScalesOptions();
    this.scales.initializeNewScalesOptions();
  }

  mapOptions(chartOptions) {
    this.id = chartOptions.id;

    if (chartOptions.attributes.maintain_aspect_ratio) {
      this.maintainAspectRatio = chartOptions.attributes.maintain_aspect_ratio;
    }

    if (chartOptions.attributes.responsive) {
      this.responsive = chartOptions.attributes.responsive;
    }

    if (chartOptions.attributes.chart_title_options && chartOptions.attributes.chart_title_options.data.length) {
      const newTitleOptions = new TitleOptions();
      newTitleOptions.initializeNewTitleOptions();

      newTitleOptions.mapTitleOptions(chartOptions.attributes.chart_title_options.data[0]);

      this.title = newTitleOptions;
    }

    if (chartOptions.attributes.chart_legend_options && chartOptions.attributes.chart_legend_options.data.length) {
      const newLegendOptions = new LegendOptions();
      newLegendOptions.initializeNewLegendOptions();

      newLegendOptions.mapLegendOptions(chartOptions.attributes.chart_legend_options.data[0]);

      this.legend = newLegendOptions;
    }

    if (chartOptions.attributes.chart_tooltip_options && chartOptions.attributes.chart_tooltip_options.data.length) {
      const newTooltipOptions = new TooltipOptions();
      newTooltipOptions.initializeNewTooltipOptions();

      newTooltipOptions.mapTooltipOptions(chartOptions.attributes.chart_tooltip_options.data[0]);

      this.tooltips = newTooltipOptions;
    }
  }
}
