export class EventNote {
  id: number;
  note: string;
  chapter: string;
  page: number;

  mapNote(note) {
    this.id = note.id;
    this.note = note.attributes.note;

    return this;
  }
}
