import {Essay} from '../essay';

export class EssayPost {
  data;

  mapToPost(essay: Essay, isPatch: boolean) {
    this.data = {
      type: 'essay',
      attributes: {
        title: essay.title,
        banner: essay.banner,
        abstract: essay.abstract,
        essay: essay.essay
      }
    };

    if (essay.type && essay.type.id) {
      this.data.attributes.type_rel = {
        data: {
          type: 'essay_type',
          id: essay.type.id
        }
      };
    }

    if (isPatch) {
      this.data.id = essay.id;
    }
  }
}
