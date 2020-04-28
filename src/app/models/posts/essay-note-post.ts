import {Essay} from '../essay';
import {EssayNote} from '../essay-note';

export class EssayNotePost {
  data;

  mapToPost(essay: Essay, essayNote: EssayNote, isPatch: boolean) {
    this.data = {
      type: 'essay_note',
      attributes: {
        note: essayNote.note,

        essay_rel: {
          data: {
            type: 'essay',
            id: essay.id
          }
        }
      }
    };

    if (essayNote.source && essayNote.source.id) {
      this.data.attributes.reference_rel = {
        data: {
          type: 'reference',
          id: essayNote.source.id
        }
      };
    }

    if (essayNote.referenceChapter) {
      this.data.attributes.reference_chapter = essayNote.referenceChapter;
    }

    if (essayNote.referencePage) {
      this.data.attributes.reference_page = essayNote.referencePage;
    }

    if (isPatch) {
      this.data.id = essayNote.id;
    }
  }
}
