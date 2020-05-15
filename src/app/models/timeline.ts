import { Person } from './person';
import { Event } from './event';
import {TimelineCategory} from './timeline-category';

export class Timeline {
  id: number;
  label: string;
  description: string;
  events: Event[];
  persons: Person[];
  categories: TimelineCategory[];

  eventId: number; // if the timeline is returned as an event-timeline object
  personId: number;

  initializeNewTimeline() {
    this.id = 0;
    this.label = '';
    this.events = [];
    this.persons = [];
    this.categories = [];
  }

  mapTimeline(timeline, timelineEventId, timelinePersonId) {
    const self = this;

    // in the case that the timeline object is returned as a timeline-event record the ID
    if (timelineEventId) {
      this.eventId = timelineEventId;
    }

    if (timelinePersonId) {
      this.personId = timelinePersonId;
    }

    self.id = timeline.id;
    self.label = timeline.attributes.label;
    self.description = timeline.attributes.description;

    if (timeline.attributes.timeline_category) {
      if (timeline.attributes.timeline_category.data.length) {
        self.categories = [];

        for (const returnedCategory of timeline.attributes.timeline_category.data) {
          const category: TimelineCategory = new TimelineCategory();

          category.mapTimelineCategory(returnedCategory);

          self.categories.push(category);
        }
      }
    }

    if (timeline.attributes.timeline_event) {
      if (timeline.attributes.timeline_event.data.length) {
        self.events = [];

        for (const returnedEvent of timeline.attributes.timeline_event.data) {
          const event: Event = new Event();
          event.mapEvent(
            returnedEvent.attributes.event.data,
            returnedEvent.attributes.is_shadow,
            returnedEvent.attributes.priority,
            returnedEvent.id);

          self.events.push(event);
        }
      }
    }

    if (timeline.attributes.timeline_person) {
      if (timeline.attributes.timeline_person.data.length) {

        self.persons = [];

        for (const returnedPerson of timeline.attributes.timeline_person.data) {
          const person: Person = new Person();
          person.mapPerson(returnedPerson.attributes.person.data);

          self.persons.push(person);
        }
      }
    }
  }
}
