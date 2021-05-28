import {TimelineCategory} from './timeline-category';
import {TimelinePerson} from './timeline-person';
import {TimelineEvent} from './timeline-event';

export class Timeline {
  id: number;
  label: string;
  description: string;
  events: TimelineEvent[];
  persons: TimelinePerson[];
  categories: TimelineCategory[];

  initializeNewTimeline() {
    this.id = 0;
    this.description = '';
    this.label = '';
    this.events = [];
    this.persons = [];
    this.categories = [];
  }

  mapTimeline(timeline) {
    const self = this;

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
          const timelineEvent: TimelineEvent = new TimelineEvent();
          timelineEvent.initializeNewTimelineEvent();
          timelineEvent.mapTimelineEvent(returnedEvent);

          self.events.push(timelineEvent);
        }
      }
    }

    if (timeline.attributes.timeline_person) {
      if (timeline.attributes.timeline_person.data.length) {

        self.persons = [];

        for (const returnedPerson of timeline.attributes.timeline_person.data) {
          const person: TimelinePerson = new TimelinePerson();
          person.mapTimelinePerson(returnedPerson.attributes.person.data);

          self.persons.push(person);
        }
      }
    }
  }
}
