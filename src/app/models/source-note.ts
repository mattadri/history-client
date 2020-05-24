export class SourceNote {
  id: number;
  note: string;
  chapter: string;
  page: number;

  initializeNote() {
    this.note = '';
    this.chapter = null;
    this.page = null;
  }

  mapNote(note) {
    this.id = note.id;
    this.note = note.attributes.note;

    if (note.attributes.chapter) {
      this.chapter = note.attributes.chapter;
    }

    if (note.attributes.page) {
      this.page = note.attributes.page;
    }

    return this;
  }
}
