import { Person } from './person';
import { Timeline } from './timeline';

export class TimelinePerson {
  id: number;
  timeline: Timeline;
  person: Person;

  initializeNewTimelinePerson() {
    this.id = null;
    this.timeline = new Timeline();
    this.person = new Person();
  }

  mapTimelinePerson(timeline: Timeline, person: Person) {
    this.id = person.timelinePersonId;
    this.timeline = timeline;
    this.person = person;
  }
}
