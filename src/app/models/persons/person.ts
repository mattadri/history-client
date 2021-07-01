import { environment } from '../../../environments/environment';

import { Source } from '../source';
import { Month } from '../month';
import { Era } from '../era';
import { PersonNote } from './person-note';
import { PersonBiography } from './person-biography';
import {PersonTimeline} from './person-timeline';

export class Person {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  image: string;
  description: string;
  birthDay: number;
  birthMonth: Month;
  birthYear: number;
  birthEra: Era;
  deathDay: number;
  deathMonth: Month;
  deathYear: number;
  deathEra: Era;
  source: Source;
  notes: PersonNote[];
  personTimelines: PersonTimeline[];
  personBiographies: PersonBiography[];

  timelinePersonId: number;

  timelineStartLocation: number;
  timelineEndLocation: number;
  listEventIsHighlighted: boolean;

  formattedBirthYear: string;
  formattedDeathYear: string;
  formattedBirth: string;
  formattedDeath: string;

  age: number;

  colorClass: string;

  defaultImage: string;

  initializeNewPerson() {
    this.defaultImage = 'https://s3.us-east-2.amazonaws.com/' + environment.s3Bucket + '/history_default.png';

    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
    this.image = this.defaultImage;
    this.description = '';
    this.birthDay = null;
    this.birthMonth = new Month();
    this.birthYear = null;
    this.birthEra = new Era();
    this.deathDay = null;
    this.deathMonth = new Month();
    this.deathYear = null;
    this.deathEra = new Era();
    this.source = new Source();
    this.notes = [];
    this.personTimelines = [];
    this.personBiographies = [];

    this.timelineStartLocation = null;
    this.listEventIsHighlighted = false;

    this.formattedBirthYear = '';
    this.formattedDeathYear = '';
    this.formattedBirth = '';
    this.formattedDeath = '';

    this.age = null;
  }

  mapPerson(person) {
    const self = this;

    const birthMonth = new Month();
    const birthEra = new Era();

    const deathMonth = new Month();
    const deathEra = new Era();

    const source = new Source();

    birthMonth.initializeNewMonth();
    deathMonth.initializeNewMonth();

    birthEra.initializeNewEra();
    deathEra.initializeNewEra();

    source.initializeSource();

    self.id = person.id;
    self.firstName = person.attributes.first_name;

    // optional fields
    if (person.attributes.birth_year) {
      self.birthYear = person.attributes.birth_year;
    }

    if (person.attributes.birth_era) {
      birthEra.mapEra(person.attributes.birth_era.data);

      self.birthEra = birthEra;
    }

    if (person.attributes.description) {
      self.description = person.attributes.description;
    }

    if (person.attributes.middle_name) {
      self.middleName = person.attributes.middle_name;
    }

    if (person.attributes.last_name) {
      self.lastName = person.attributes.last_name;
    }

    if (person.attributes.image) {
      self.image = person.attributes.image;
    }

    if (person.attributes.birth_day) {
      self.birthDay = person.attributes.birth_day;
    }

    if (person.attributes.birth_month) {
      birthMonth.mapMonth(person.attributes.birth_month.data);

      this.birthMonth = birthMonth;
    }

    if (person.attributes.death_day) {
      self.deathDay = person.attributes.death_day;
    }

    if (person.attributes.death_month) {
      deathMonth.mapMonth(person.attributes.death_month.data);

      self.deathMonth = deathMonth;
    }

    if (person.attributes.death_year) {
      self.deathYear = person.attributes.death_year;
    }

    if (person.attributes.death_era) {
      deathEra.mapEra(person.attributes.death_era.data);

      self.deathEra = deathEra;
    }

    if (person.attributes.reference) {
      self.source = source.mapSource(person.attributes.reference.data);
    }

    if (person.attributes.person_note && person.attributes.person_note.data.length) {
      self.notes = [];

      for (const returnedNote of person.attributes.person_note.data) {
        const note: PersonNote = new PersonNote();

        self.notes.push(note.mapNote(returnedNote));
      }
    }

    if (person.attributes.birth_era) {
      this.formatYears();
      this.formatBirthAndDeath();
      this.setAge();
    }

    if (!this.image || !this.image.length) {
      this.image = this.defaultImage;
    }
  }

  formatYears() {
    if (this.birthEra.label === 'BC') {
      this.formattedBirthYear = this.birthYear.toString() + ' BC';
    } else {
      this.formattedBirthYear = this.birthYear.toString();
    }

    if (this.deathYear) {
      if (this.deathEra && this.deathEra.label === 'BC') {
        this.formattedDeathYear = this.deathYear.toString() + ' BC';
      } else {
        this.formattedDeathYear = this.deathYear.toString();
      }

    } else {
      this.formattedDeathYear = 'present';
    }
  }

  formatBirthAndDeath() {
    // BIRTH
    this.formattedBirth = '';

    if (this.birthMonth && this.birthMonth.label) {
      this.formattedBirth = this.birthMonth.label;
    }

    if (this.birthDay) {
      this.formattedBirth = this.formattedBirth + ', ' + this.birthDay.toString();
    }

    this.formattedBirth = this.formattedBirth + ' ' + this.formattedBirthYear;

    // DEATH
    this.formattedDeath = '';

    if (this.deathMonth && this.deathMonth.label) {
      this.formattedDeath = this.deathMonth.label;
    }

    if (this.deathDay) {
      this.formattedDeath = this.formattedDeath + ', ' + this.deathDay.toString();
    }

    this.formattedDeath = this.formattedDeath + ' ' + this.formattedDeathYear;
  }

  setAge() {
    if (this.deathYear) {
      this.age = (this.deathYear - this.birthYear);
    } else {
      const dateObj = new Date();
      this.age = (dateObj.getFullYear() - this.birthYear);
    }

    if (this.age < 0) {
      this.age = this.age * -1;
    }
  }
}
