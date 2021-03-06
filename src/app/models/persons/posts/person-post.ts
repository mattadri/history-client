import { Person } from '../person';

export class PersonPost {
  data;

  mapToPost(person: Person, isPatch: boolean) {
    this.data = {
      type: 'person',
      attributes: {
        first_name: person.firstName,
        birth_year: person.birthYear,
        image: person.image,
        birth_era_rel: {
          data: {
            type: 'era',
            id: person.birthEra.id
          }
        }
      }
    };

    // optional fields
    if (person.description) {
      this.data.attributes.description = person.description;
    }

    if (person.middleName) {
      this.data.attributes.middle_name = person.middleName;
    }

    if (person.lastName) {
      this.data.attributes.last_name = person.lastName;
    }

    if (person.birthDay > 0) {
      this.data.attributes.birth_day = person.birthDay;
    }

    if (person.birthMonth && person.birthMonth.id) {
      this.data.attributes.birth_month_rel = {
        data: {
          type: 'month',
          id: person.birthMonth.id
        }
      };
    }

    if (person.deathDay > 0) {
      this.data.attributes.death_day = person.deathDay;
    }

    if (person.deathMonth && person.deathMonth.id) {
      this.data.attributes.death_month_rel = {
        data: {
          type: 'month',
          id: person.deathMonth.id
        }
      };
    }

    if (person.deathYear) {
      this.data.attributes.death_year = person.deathYear;
    }

    if (person.deathEra && person.deathEra.id) {
      this.data.attributes.death_era_rel = {
        data: {
          type: 'era',
          id: person.deathEra.id
        }
      };
    }

    if ( person.source && person.source.id) {
      this.data.attributes.reference_rel = {
        data: {
          type: 'reference',
          id: person.source.id
        }
      };
    }

    if (isPatch) {
      this.data.id = person.id;
    }
  }
}
