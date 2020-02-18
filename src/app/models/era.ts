export class Era {
  id: string;
  label: string;

  mapEra(eraData) {
    this.id = eraData.id;
    this.label = eraData.attributes.label;
    return this;
  }

  initializeNewEra() {
    this.id = 0;
    this.label = '';
  }
}
