import {SourceNote} from '../source-note';
import {Source} from '../source';

export class SourceNotePost {
  data;

  mapToPost(sourceNote: SourceNote, source: Source) {
    this.data = {
      type: 'reference_note',
      attributes: {
        note: sourceNote.note,
        chapter: sourceNote.chapter,
        page: sourceNote.page,
        reference_rel: {
          data: {
            type: 'reference',
            id: source.id
          }
        }
      }
    };
  }
}
