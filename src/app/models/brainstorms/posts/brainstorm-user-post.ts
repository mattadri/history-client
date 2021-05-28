import {Brainstorm} from '../../brainstorm';

export class BrainstormUserPost {
  data: any;

  mapToPost(brainstorm: Brainstorm, userId: string) {
    this.data = {
      type: 'brainstorm_user',
      attributes: {
        brainstorm_rel: {
          data: {
            type: 'brainstorm',
            id: brainstorm.id
          }
        },

        user_rel: {
          data: {
            type: 'user',
            id: userId
          }
        }
      }
    };
  }
}
