import { Person } from './person';
import { Event } from './event';

export class Timeline {
  id: number;
  label: string;
  events: Event[];
  persons: Person[];

  mapTimeline(timeline) {
    const self = this;

    self.id = timeline.id;
    self.label = timeline.attributes.label;

    if (timeline.attributes.timeline_event) {
      if (timeline.attributes.timeline_event.data.length) {
        self.events = [];

        for (const returnedEvent of timeline.attributes.timeline_event.data) {
          const event: Event = new Event();
          event.mapEvent(returnedEvent.attributes.event.data);

          self.events.push(event);
        }
      }
    }

    console.log('Mapped Timeline: ', self);
  }
}
