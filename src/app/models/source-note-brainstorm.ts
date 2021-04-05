import {Brainstorm} from './brainstorm';
import {SourceNote} from './source-note';
export class SourceNoteBrainstorm {
  id: number;
  sourceNote: SourceNote;
  brainstorm: Brainstorm;

  initializeSourceNoteBrainstorm() {
    this.sourceNote = new SourceNote();
    this.brainstorm = new Brainstorm();
  }
}
