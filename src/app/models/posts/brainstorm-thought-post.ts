import {BrainstormThought} from '../brainstorm-thought';

export class BrainstormThoughtPost {
  data;

  mapToPost(brainstormThought: BrainstormThought, isPatch: boolean) {
    this.data = {
      type: 'brainstorm_thought',
      attributes: {
        thought: brainstormThought.thought,
        position: brainstormThought.position
      }
    };

    if (brainstormThought.brainstormId) {
      this.data.attributes.brainstorm_rel = {
        data: {
          type: 'brainstorm',
          id: brainstormThought.brainstormId
        }
      };
    }

    if (isPatch) {
      this.data.id = brainstormThought.id;
    }
  }
}
