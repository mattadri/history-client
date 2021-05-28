import { EventNote } from '../event-note';
import { Event } from '../event';

export class EventNotePost {
  data;

  mapToPost(eventNote: EventNote, event: Event, isPatch: boolean) {
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

    if (isPatch) {
      this.data.id = eventNote.id;
    }
  }
}
