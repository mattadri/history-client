import { Source } from './source';
import { Month } from './month';
import { Era } from './era';
import { Timeline } from './timeline';
import { PersonNote } from './person-note';

export class Person {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
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
  timelines: Timeline[];
  notes: PersonNote[];

  timelineStartLocation: string;
  timelineEndLocation: string;
  listEventIsHighlighted: boolean;

  formattedBirthYear: string;
  formattedDeathYear: string;
  formattedBirth: string;
  formattedDeath: string;

  age: string;

  colorClass: string;

  initializeNewPerson() {
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
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

    this.timelineStartLocation = '';
    this.listEventIsHighlighted = false;

    this.formattedBirthYear = '';
    this.formattedDeathYear = '';
    this.formattedBirth = '';
    this.formattedDeath = '';

    this.age = '';
  }

  mapPerson(person) {
    const self = this;

    const birthMonth = new Month();
    const birthEra = new Era();

    const deathMonth = new Month();
    const deathEra = new Era();

    const source = new Source();

    self.id = person.id;
    self.firstName = person.attributes.first_name;

    if (person.attributes.birth_year) {
      self.birthYear = person.attributes.birth_year;
    }

    if (person.attributes.birth_era) {
      self.birthEra = birthEra.mapEra(person.attributes.birth_era.data);
    }

    // optional fields
    if (person.attributes.description) {
      self.description = person.attributes.description;
    }

    if (person.attributes.middle_name) {
      self.middleName = person.attributes.middle_name;
    }

    if (person.attributes.last_name) {
      self.lastName = person.attributes.last_name;
    }

    if (person.attributes.birth_day) {
      self.birthDay = person.attributes.birth_day;
    }

    if (person.attributes.birth_month) {
      self.birthMonth = birthMonth.mapMonth(person.attributes.birth_month.data);
    }

    if (person.attributes.death_day) {
      self.deathDay = person.attributes.death_day;
    }

    if (person.attributes.death_month) {
      self.deathMonth = deathMonth.mapMonth(person.attributes.death_month.data);
    }

    if (person.attributes.death_year) {
      self.deathYear = person.attributes.death_year;
    }

    if (person.attributes.death_era) {
      self.deathEra = deathEra.mapEra(person.attributes.death_era.data);
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

    if (person.attributes.timeline_person && person.attributes.timeline_person.data.length) {
      self.timelines = [];

      for (const returnedTimeline of person.attributes.timeline_person.data) {
        const timeline: Timeline = new Timeline();

        timeline.mapTimeline(returnedTimeline.attributes.timeline.data, null, returnedTimeline.id);

        self.timelines.push(timeline);
      }
    }

    if (person.attributes.birth_era) {
      this.formatYears();
      this.formatBirthAndDeath();
      this.setAge();
    }
  }

  formatYears() {
    if (this.birthEra.label === 'BC') {
      this.formattedBirthYear = this.birthYear.toString() + ' BC';
    } else {
      this.formattedBirthYear = this.birthYear;
    }

    if (this.deathYear) {
      if (this.deathEra && this.deathEra.label === 'BC') {
        this.formattedDeathYear = this.deathYear.toString() + ' BC';
      } else {
        this.formattedDeathYear = this.deathYear;
      }

    } else {
      this.formattedDeathYear = 'present';
    }
  }

  formatBirthAndDeath() {
    // BIRTH
    this.formattedBirth = '';

    if (this.birthMonth) {
      this.formattedBirth = this.birthMonth.label;
    }

    if (this.birthDay) {
      this.formattedBirth = this.formattedBirth + ', ' + this.birthDay.toString();
    }

    this.formattedBirth = this.formattedBirth + ' ' + this.formattedBirthYear;

    // DEATH
    this.formattedDeath = '';

    if (this.deathMonth) {
      this.formattedDeath = this.deathMonth.label;
    }

    if (this.deathDay) {
      this.formattedDeath = this.formattedDeath + ', ' + this.deathDay.toString();
    }

    this.formattedDeath = this.formattedDeath + ' ' + this.formattedDeathYear;
  }

  setAge() {
    if (this.deathYear) {
      this.age = (this.deathYear - this.birthYear).toString();
    } else {
      const dateObj = new Date();
      this.age = (dateObj.getFullYear() - this.birthYear).toString();
    }

    if (this.age < 0) {
      this.age = this.age * -1;
    }
  }
}
