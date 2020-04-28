import { EventNote } from '../event-note';
import { Event } from '../event';

export class EventNotePost {
  data;

  mapToPost(eventNote: EventNote, event: Event) {
    this.data = {
      type: 'event_note',
      attributes: {
        note: eventNote.note,
        event_rel: {
          data: {
            type: 'event',
            id: event.id
          }
        }
      }
    };
  }
}
