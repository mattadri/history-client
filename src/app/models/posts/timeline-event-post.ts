import {Timeline} from '../timelines/timeline';
import {Event} from '../events/event';

export class TimelineEventPost {
  data;

  mapToPost(event: Event, timeline: Timeline, isShadow: boolean, priority: number, isPatch: boolean, timelineEventId: number) {
    this.data = {
      type: 'timeline_event',
      attributes: {
        timeline_rel: {
          data: {
            type: 'timeline',
            id: timeline.id
          }
        },
        event_rel: {
          data: {
            type: 'event',
            id: event.id
          }
        },
        is_shadow: isShadow,
        priority: priority
      }
    };

    if (isPatch) {
      this.data.id = timelineEventId;
    }
  }
}
