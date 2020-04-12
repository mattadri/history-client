import {TimelineCategory} from '../timeline-category';
import {Timeline} from '../timeline';

export class TimelineCategoryPost {
  data: object;

  mapToPost(timelineCategory: TimelineCategory, timeline: Timeline) {
    this.data = {
      type: 'timeline_category',
      attributes: {
        timeline_rel: {
          data: {
            type: 'timeline',
            id: timeline.id
          }
        },
        label: timelineCategory.label
      }
    };
  }
}
