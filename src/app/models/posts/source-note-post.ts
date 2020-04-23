import {SourceNote} from '../source-note';
import {Source} from '../reference';

export class SourceNotePost {
  data: object;

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
