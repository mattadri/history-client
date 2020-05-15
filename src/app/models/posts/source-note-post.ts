import {SourceNote} from '../source-note';
import {Source} from '../source';

export class SourceNotePost {
  data;

  mapToPost(sourceNote: SourceNote, source: Source, isPatch: boolean) {
    this.data = {
      type: 'reference_note',
      attributes: {
        note: sourceNote.note,
        reference_rel: {
          data: {
            type: 'reference',
            id: source.id
          }
        }
      }
    };

    if (sourceNote.chapter) {
      this.data.attributes.chapter = sourceNote.chapter;
    }

    if (sourceNote.page) {
      this.data.attributes.page = sourceNote.page;
    }

    if (isPatch) {
      this.data.id = sourceNote.id;
    }
  }
}
