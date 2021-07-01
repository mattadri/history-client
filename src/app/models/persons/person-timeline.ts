import {Timeline} from '../timelines/timeline';

export class PersonTimeline {
  id: number;
  timeline: Timeline;

  initializeNewPersonTimeline() {
    this.id = null;

    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();
  }

  mapPersonTimeline(personTimeline, included) {
    this.id = personTimeline.id;

    let timelineId = personTimeline.relationships.timeline_rel.data.id;
    let timelineType = personTimeline.relationships.timeline_rel.data.type;

    let returnedPersonTimeline = this.objectLookup(timelineId, timelineType, included);

    let timeline = new Timeline();
    timeline.initializeNewTimeline();

    timeline.mapTimeline(returnedPersonTimeline);

    this.timeline = timeline;
  }

  objectLookup(id, type, included) {
    let foundItem = null;

    for (const item of included) {
      if (item.id.toString() === id.toString() && item.type.toLowerCase() === type.toLowerCase()) {
        foundItem = item;
        break;
      }
    }

    return foundItem;
  }
}
