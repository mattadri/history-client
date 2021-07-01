export class Month {
  id: number;
  label: string;

  initializeNewMonth() {
    this.label = '';
  }

  mapMonth(monthData) {
    this.id = monthData.id;
    this.label = monthData.attributes.label;
  }
}
