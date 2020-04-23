export class SourceNote {
  id: number;
  note: string;
  chapter: string;
  page: number;

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

  initializeNote() {
    this.note = '';
    this.chapter = '';
    this.page = null;
  }
}
