import {Brainstorm} from '../brainstorm';
export class BrainstormPost {
  data: any;

  mapToPost(brainstorm: Brainstorm, isPatch: boolean) {
    this.data = {
      type: 'brainstorm',
      attributes: {
        title: brainstorm.title
      }
    };

    if (brainstorm.description) {
      this.data.attributes.description = brainstorm.description;
    }

    if (isPatch) {
      this.data.id = brainstorm.id;
    }
  }
}
