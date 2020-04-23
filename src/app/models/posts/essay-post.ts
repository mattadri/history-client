import {Essay} from '../essay';

export class EssayPost {
  data: object;

  mapToPost(essay: Essay, isPatch: boolean) {
    this.data = {
      type: 'essay',
      attributes: {
        title: essay.title,
        abstract: essay.abstract,
        essay: essay.essay
      }
    };

    if (isPatch) {
      this.data.id = essay.id;
    }
  }
}
