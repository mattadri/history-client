import { Timeline } from '../timeline';

export class TimelinePost {
  data: object;

  mapToPost(timeline: Timeline) {
    this.data = {
      type: 'timeline',
      attributes: {
        label: timeline.label
      }
    };
  }
}
