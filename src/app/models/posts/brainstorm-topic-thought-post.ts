import {BrainstormThought} from '../brainstorm-thought';

export class BrainstormTopicThoughtPost {
  data;

  mapToPost(brainstormThought: BrainstormThought, isPatch: boolean) {
    this.data = {
      type: 'brainstorm_topic_thought',
      attributes: {
        thought: brainstormThought.thought,
        position: brainstormThought.position,
      }
    };

    if (brainstormThought.topicId) {
      this.data.attributes.brainstorm_topic_rel = {
        data: {
          type: 'brainstorm_topic',
          id: brainstormThought.topicId
        }
      };
    }

    if (isPatch) {
      this.data.id = brainstormThought.id;
    }
  }
}
