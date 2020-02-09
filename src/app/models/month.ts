export class Month {
  id: number;
  label: string;

  mapMonth(monthData) {
    this.id = monthData.id;
    this.label = monthData.attributes.label;

    return this;
  }
}
