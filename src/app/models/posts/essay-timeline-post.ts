import {EssayTimeline} from '../essay-timeline';
import {Essay} from '../essay';

export class EssayTimelinePost {
  data;

  mapToPost(essay: Essay, essayTimeline: EssayTimeline) {
    this.data = {
      type: 'essay_timeline',
      attributes: {
        essay_rel: {
          data: {
            type: 'essay',
            id: essay.id
          }
        },

        timeline_rel: {
          data: {
            type: 'timeline',
            id: essayTimeline.timeline.id
          }
        }
      }
    };
  }
}
