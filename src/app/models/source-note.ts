import {Brainstorm} from './brainstorm';
export class SourceNote {
  id: number;
  note: string;
  chapter: string;
  page: number;
  exportBrainstorms: Brainstorm[];

  initializeNote() {
    this.note = '';
    this.chapter = null;
    this.page = null;

    this.exportBrainstorms = [];
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

    if (note.attributes.reference_note_export_destination.data && note.attributes.reference_note_export_destination.data.length) {
      for (const exportBrainstorm of note.attributes.reference_note_export_destination.data) {
        const brainstorm = new Brainstorm();
        brainstorm.initializeNewBrainstorm();
        brainstorm.mapBrainstorm(exportBrainstorm.attributes.brainstorm.data);

        this.exportBrainstorms.push(brainstorm);
      }
    }

    return this;
  }
}
