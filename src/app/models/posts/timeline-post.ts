import { Timeline } from '../timeline';

export class TimelinePost {
  data: object;

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
