import {Essay} from '../essays/essay';
import {Person} from './person';

export class PersonBiography {
  id: number;
  biography: Essay;
  person: Person;

  initializeBiography() {
    this.biography = new Essay();
    this.biography.initializeNewEssay();
  }

  mapBiography(biography) {
    this.id = biography.id;

    const essay: Essay = new Essay();
    essay.initializeNewEssay();

    this.biography = essay.mapEssay(biography.attributes.essay.data);

    const person: Person = new Person();
    person.initializeNewPerson();
    person.mapPerson(biography.attributes.person.data);

    this.person = person;

    return this;
  }
}
