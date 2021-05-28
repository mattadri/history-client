import {User} from '../user';
import {Essay} from './essay';

export class EssayUser {
  id: number;

  user: User;
  essay: Essay;

  initializeNewEssayUser() {
    this.id = null;

    this.user = new User();
    this.essay = new Essay();
  }

  mapEssayUser(essayUser) {
    this.id = essayUser.id;

    this.user = new User();
    this.user.mapUser(essayUser.attributes.user.data);

    this.essay = new Essay();
    this.essay.mapEssay(essayUser.attributes.essay.data);
  }
}
