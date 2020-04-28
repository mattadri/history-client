import {EssayReference} from '../essay-reference';
import {Essay} from '../essay';

export class EssayReferencePost {
  data;

  mapToPost(essay: Essay, essayReference: EssayReference, isPatch: boolean) {
    this.data = {
      type: 'essay_reference',
      attributes: {
        essay_rel: {
          data: {
            type: 'essay',
            id: essay.id
          }
        },
        reference_rel: {
          data: {
            type: 'reference',
            id: essayReference.source.id
          }
        }
      }
    };

    if (essayReference.sourceChapter) {
      this.data.attributes.chapter = essayReference.sourceChapter;
    }

    if (essayReference.sourcePage) {
      this.data.attributes.page = essayReference.sourcePage;
    }

    if (isPatch) {
      this.data.id = essayReference.id;
    }
  }
}
