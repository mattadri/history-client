import {EssayUser} from '../essay-user';

export class EssayUserPost {
  data;

  mapToPost(essayUser: EssayUser, isPatch: boolean) {
    this.data = {
      type: 'essay_user',
      attributes: {
        essay_rel: {
          data: {
            type: 'essay',
            id: essayUser.essay.id
          }
        },

        user_rel: {
          data: {
            type: 'user',
            id: essayUser.user.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = essayUser.id;
    }
  }
}
