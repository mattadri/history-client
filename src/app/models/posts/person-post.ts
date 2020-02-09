import { Person } from '../person';

export class PersonPost {
  data: object;

  mapToPost(person: Person) {
    this.data = {
      type: 'person',
      attributes: {
        first_name: person.firstName,
        middle_name: person.middleName,
        last_name: person.lastName,
        birth_year: person.birthYear,
        birth_era_rel: {
          data: {
            type: 'era',
            id: person.birthEra.id
          }
        },
        death_year: person.deathYear,
        death_era_rel: {
          data: {
            type: 'era',
            id: person.deathEra.id
          }
        },
        reference_rel: {
          data: {
            type: 'reference',
            id: person.reference.id
          }
        }
      }
    };

    // optional fields
    if (person.birthDay > 0) {
      this.data.attributes.birth_day = person.birthDay;
    }

    if (person.birthMonth.id) {
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

    if (person.deathMonth.id) {
      this.data.attributes.death_month_rel = {
        data: {
          type: 'month',
          id: person.deathMonth.id
        }
      };
    }
  }
}
