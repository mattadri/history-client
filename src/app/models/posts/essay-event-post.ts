import {Essay} from '../essay';
import {EssayEvent} from '../essay-event';
export class EssayEventPost {
  data: object;

  mapToPost(essay: Essay, essayEvent: EssayEvent) {
    this.data = {
      type: 'essay_event',
      attributes: {
        essay_rel: {
          data: {
            type: 'essay',
            id: essay.id
          }
        },

        event_rel: {
          data: {
            type: 'event',
            id: essayEvent.event.id
          }
        }
      }
    };
  }
}
