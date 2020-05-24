import {Source} from './source';

export class EssayNote {
  id: number;
  note: string;
  source: Source;
  chapter: string;
  page: number;

  initializeNewEssayNote() {
    this.id = null;
    this.note = '';
    this.source = new Source();
    this.source.initializeSource();
    this.chapter = '';
    this.page = null;
  }

  mapNote(note) {
    this.id = note.id;
    this.note = note.attributes.note;

    if (note.attributes.reference) {
      const source = new Source();
      source.initializeSource();

      source.mapSource(note.attributes.reference.data);

      this.source = source;
    }

    if (note.attributes.reference_chapter) {
      this.chapter = note.attributes.reference_chapter;
    }

    if (note.attributes.reference_page) {
      this.page = note.attributes.reference_page;
    }
  }
}
