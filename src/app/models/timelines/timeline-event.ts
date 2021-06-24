import { Event } from '../events/event';

export class TimelineEvent {
  id: number;
  isShadow: boolean;
  priority: number;
  event: Event;

  initializeNewTimelineEvent() {
    this.id = null;

    this.event = new Event();
    this.event.initializeNewEvent();

    this.isShadow = false;
    this.priority = 0;
  }

  mapTimelineEvent(timelineEvent) {
    this.id = timelineEvent.id;
    this.isShadow = timelineEvent.attributes.is_shadow;
    this.priority = timelineEvent.attributes.priority;

    this.event.mapEvent(timelineEvent.attributes.event.data);
  }
}
