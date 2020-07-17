export class EssayType {
  id: number;
  label: string;

  initializeNewEssayType() {
    this.label = '';
  }

  mapEssayType(essayType) {
    this.id = essayType.id;

    this.label = essayType.attributes.label;
  }
}
