import { TimelineEvent } from '../timeline-event';

export class TimelineEventPost {
  data: object;

  mapToPost(timelineEvent: TimelineEvent, isPatch: boolean) {
    this.data = {
      type: 'timeline_event',
      attributes: {
        timeline_rel: {
          data: {
            type: 'timeline',
            id: timelineEvent.timeline.id
          }
        },
        event_rel: {
          data: {
            type: 'event',
            id: timelineEvent.event.id
          }
        },
        is_shadow: timelineEvent.isShadow,
        priority: timelineEvent.priority
      }
    };

    if (isPatch) {
      this.data.id = timelineEvent.id;
    }
  }
}
