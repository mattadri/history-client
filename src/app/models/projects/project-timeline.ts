import {Timeline} from '../timelines/timeline';

export class ProjectTimeline {
  id: number;

  timeline: Timeline;

  mapProjectTimeline(projectTimeline) {
    this.id = projectTimeline.id;

    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();
    this.timeline.mapTimeline(projectTimeline.attributes.timeline.data);
  }

  initializeNewProjectTimeline() {
    this.timeline = new Timeline();
  }
}
