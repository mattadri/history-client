import { EventNote } from './event-note';

export class EventNotePost {
  data: object;

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
