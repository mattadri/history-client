import {Timeline} from '../timelines/timeline';
import {Person} from './person';

export class PersonTimeline {
  id: number;
  timeline: Timeline;
  person: Person;

  initializeNewPersonTimeline() {
    this.id = null;
    this.timeline = new Timeline();
    this.person = new Person();
  }

  mapPersonTimeline(personTimeline) {
    this.id = personTimeline.id;

    this.timeline.mapTimeline(personTimeline.attributes.timeline.data);
    this.person.mapPerson(personTimeline.attributes.person.data);
  }
}
