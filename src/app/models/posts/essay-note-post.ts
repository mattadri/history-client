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

    if (essayNote.chapter) {
      this.data.attributes.reference_chapter = essayNote.chapter;
    }

    if (essayNote.page) {
      this.data.attributes.reference_page = essayNote.page;
    }

    if (isPatch) {
      this.data.id = essayNote.id;
    }
  }
}
