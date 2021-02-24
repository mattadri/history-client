import {SourceNote} from '../source-note';
import {Brainstorm} from '../brainstorm';
export class SourceNoteBrainstormPost {
  data;

  mapToPost(sourceNote: SourceNote, brainstorm: Brainstorm, isPatch: boolean) {
    this.data = {
      type: 'reference_note_export_brainstorm_destination',

      attributes: {
        reference_note_rel: {
          data: {
            type: 'reference_note',
            id: sourceNote.id
          }
        },

        brainstorm_rel: {
          data: {
            type: 'brainstorm',
            id: brainstorm.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = sourceNote.id;
    }
  }
}
