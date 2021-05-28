import {Timeline} from '../timelines/timeline';

export class EventTimeline {
  id: number;
  timeline: Timeline;

  initializeNewEventTimeline() {
    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();
  }

  mapEventTimeline(eventTimeline) {
    this.id = eventTimeline.id;
    this.timeline.mapTimeline(eventTimeline.attributes.timeline.data);
  }
}
