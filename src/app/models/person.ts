import { Reference } from './reference';
import { Month } from './month';
import { Era } from './era';

export class Person {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDay: number;
  birthMonth: Month;
  birthYear: number;
  birthEra: Era;
  deathDay: number;
  deathMonth: Month;
  deathYear: number;
  deathEra: Era;
  reference: Reference;

  mapPerson(person) {
    const self = this;

    const birthMonth = new Month();
    const birthEra = new Era();

    const deathMonth = new Month();
    const deathEra = new Era();

    const reference = new Reference();

    self.id = person.id;
    self.firstName = person.attributes.first_name;
    self.birthYear = person.attributes.birth_year;
    self.birthEra = birthEra.mapEra(person.attributes.birth_era.data);
    self.deathYear = person.attributes.death_year;
    self.deathEra = deathEra.mapEra(person.attributes.death_era.data);

    // optional fields
    if (person.attributes.middle_name) {
      self.middleName = person.attributes.middle_name;
    }

    if (person.attributes.last_name) {
      self.lastName = person.attributes.last_name;
    }

    if (person.attributes.birthDay) {
      self.birthDay = person.attributes.birthDay;
    }

    if (person.attributes.birthMonth) {
      self.birthMonth = birthMonth.mapMonth(person.attributes.birth_month.data);
    }

    if (person.attributes.deathDay) {
      self.deathDay = person.attributes.death_day;
    }

    if (person.attributes.deathMonth) {
      self.deathMonth = deathMonth.mapMonth(person.attributes.death_month.data);
    }

    if (person.attributes.reference) {
      self.reference = reference.mapReference(person.attributes.reference.data);
    }
  }
}
