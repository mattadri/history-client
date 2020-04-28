import { Timeline } from '../timeline';

export class TimelinePost {
  data;

  mapToPost(timeline: Timeline, isPatch) {
    this.data = {
      type: 'timeline',
      attributes: {
        label: timeline.label
      }
    };

    if (isPatch) {
      this.data.id = timeline.id;
    }
  }
}
