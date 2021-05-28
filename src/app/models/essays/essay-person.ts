import {Person} from '../persons/person';

export class EssayPerson {
  id: number;
  person: Person;

  initializeNewEssayPerson() {
    this.id = null;
    this.person = new Person();
  }

  mapEssayPerson(essayPerson) {
    this.id = essayPerson.id;

    this.person = new Person();
    this.person.mapPerson(essayPerson.attributes.person.data);
  }
}
