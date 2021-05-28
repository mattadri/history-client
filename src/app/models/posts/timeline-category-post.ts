import {TimelineCategory} from '../timelines/timeline-category';
import {Timeline} from '../timelines/timeline';

export class TimelineCategoryPost {
  data;

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
