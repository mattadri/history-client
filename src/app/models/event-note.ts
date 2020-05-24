import {Source} from './source';

export class EventNote {
  id: number;
  note: string;

  initializeNote() {
    this.note = '';
  }

  mapNote(note) {
    this.id = note.id;
    this.note = note.attributes.note;
  }
}
