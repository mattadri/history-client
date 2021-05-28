import {EssayPerson} from '../essay-person';
import {Essay} from '../essay';

export class EssayPersonPost {
  data;

  mapToPost(essay: Essay, essayPerson: EssayPerson) {
    this.data = {
      type: 'essay_person',
      attributes: {
        essay_rel: {
          data: {
            type: 'essay',
            id: essay.id
          }
        },

        person_rel: {
          data: {
            type: 'person',
            id: essayPerson.person.id
          }
        }
      }
    };
  }
}
