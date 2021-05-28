import {Source} from '../source';
export class EssayReference {
  id: number;
  source: Source;
  sourcePage: number;
  sourceChapter: string;

  initializeNewEssayReference() {
    this.id = null;
    this.source = new Source();
    this.sourcePage = 0;
    this.sourceChapter = '';
  }

  mapEssayReference(essayReference) {
    this.id = essayReference.id;

    this.source = new Source();
    this.source.mapSource(essayReference.attributes.reference.data);

    if (essayReference.attributes.page) {
      this.sourcePage = essayReference.attributes.page;
    }

    if (essayReference.attributes.chapter) {
      this.sourceChapter = essayReference.attributes.chapter;
    }
  }
}
