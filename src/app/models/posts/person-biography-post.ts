import {Essay} from '../essay';
import {Person} from '../person';

export class PersonBiographyPost {
  data;

  mapToPersonBiographyPost(person: Person, biography: Essay) {
    this.data = {
      type: 'person_biography',
      attributes: {
        essay_rel: {
          data: {
            type: 'essay',
            id: biography.id
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
