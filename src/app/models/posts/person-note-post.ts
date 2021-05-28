import {PersonNote} from '../persons/person-note';
import {Person} from '../persons/person';

export class PersonNotePost {
  data;

  mapToNotePost(personNote: PersonNote, person: Person, isPatch: boolean) {
    this.data = {
      type: 'person_note',
      attributes: {
        note: personNote.note,
        person_rel: {
          data: {
            type: 'person',
            id: person.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = personNote.id;
    }
  }
}
