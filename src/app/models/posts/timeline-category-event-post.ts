import {TimelineCategory} from '../timelines/timeline-category';
import {Event} from '../events/event';

export class TimelineCategoryEventPost {
  data;

  mapToPost(timelineCategory: TimelineCategory, event: Event) {
    this.data = {
      type: 'timeline_category_event',
      attributes: {
        timeline_category_rel: {
          data: {
            type: 'timeline_category',
            id: timelineCategory.id
          }
        },
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
