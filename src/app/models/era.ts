export class Era {
  id: string;
  label: string;

  mapEra(eraData) {
    this.id = eraData.id;
    this.label = eraData.attributes.label;
    return this;
  }
}
