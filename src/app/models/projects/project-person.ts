import {Person} from '../persons/person';

export class ProjectPerson {
  id: number;

  person: Person;

  mapProjectPerson(projectPerson) {
    this.id = projectPerson.id;

    this.person = new Person();
    this.person.initializeNewPerson();
    this.person.mapPerson(projectPerson.attributes.person.data);
  }

  initializeNewProjectPerson() {
    this.person = new Person();
  }
}
