import { Person } from '../persons/person';

export class TimelinePerson {
  id: number;
  person: Person;

  initializeNewTimelinePerson() {
    this.id = null;
    this.person = new Person();
  }

  mapTimelinePerson(person: Person) {
    this.id = person.timelinePersonId;

    this.person = new Person();
    this.person.initializeNewPerson();
    this.person.mapPerson(person);
  }
}
