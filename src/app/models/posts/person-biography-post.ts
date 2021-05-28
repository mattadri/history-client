import {PersonBiography} from '../persons/person-biography';

export class PersonBiographyPost {
  data;

  mapToPersonBiographyPost(personBiography: PersonBiography) {
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
            id: personBiography.person.id
          }
        }
      }
    };
  }
}
