import {PersonNote} from '../person-note';
import {Person} from '../person';

export class PersonNotePost {
  data: object;

  mapToNotePost(personNote: PersonNote, person: Person) {
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
  }
}
