export class ChartLabel {
  id: number;
  label: string;

  initializeNewChartLabel() {
    this.label = 'Auto Generated Label';
  }

  mapChartLabel(label) {
    this.id = label.id;
    this.label = label.attributes.label;
  }
}
