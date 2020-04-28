import {Timeline} from './timeline';

export class EssayTimeline {
  id: number;
  timeline: Timeline;

  initializeNewEssayTimeline() {
    this.id = null;
    this.timeline = new Timeline();
  }

  mapEssayTimeline(essayTimeline) {
    this.id = essayTimeline.id;

    this.timeline = new Timeline();
    this.timeline.mapTimeline(essayTimeline.attributes.timeline.data, null, null);
  }
}
