export class PersonNote {
  id: number;
  note: string;

  mapNote(note) {
    this.id = note.id;
    this.note = note.attributes.note;

    return this;
  }
}
