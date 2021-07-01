import {PersonBiography} from '../person-biography';
import {Person} from '../person';

export class PersonBiographyPost {
  data;

  mapToPersonBiographyPost(personBiography: PersonBiography, person: Person) {
    this.data = {
      type: 'person_biography',
      attributes: {
        essay_rel: {
          data: {
            type: 'essay',
            id: personBiography.biography.id
          }
        },
        person_rel: {
          data: {
            type: 'person',
            id: person.id
          }
        }
      }
    };
  }
}
