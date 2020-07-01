export class Era {
  id: number;
  label: string;

  mapEra(eraData) {
    this.id = eraData.id;
    this.label = eraData.attributes.label;

    return this;
  }

  initializeNewEra() {
    this.id = 0;
    this.label = 'AD';
  }
}
