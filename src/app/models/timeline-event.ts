import { Event } from './event';
import { Timeline } from './timeline';

export class TimelineEvent {
  id: number;
  isShadow: boolean;
  priority: number;
  timeline: Timeline;
  event: Event;

  initializeNewTimelineEvent() {
    this.id = null;
    this.timeline = new Timeline();
    this.event = new Event();
    this.isShadow = false;
    this.priority = 0;
  }

  mapTimelineEvent(timeline: Timeline, event: Event) {
    this.id = event.timelineEventId;
    this.timeline = timeline;
    this.event = event;
    this.isShadow = this.event.isShadow;
    this.priority = this.event.priority;
  }
}
