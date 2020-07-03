import {BrainstormTopic} from '../brainstorm-topic';
import {Brainstorm} from '../brainstorm';

export class BrainstormTopicPost {
  data;

  mapToPost(brainstorm: Brainstorm, brainstormTopic: BrainstormTopic, isPatch: boolean) {
    this.data = {
      type: 'brainstorm_topic',
      attributes: {
        label: brainstormTopic.label,
        position: brainstormTopic.position
      }
    };

    if (brainstorm) {
      this.data.attributes.brainstorm_rel = {
        data: {
          type: 'brainstorm',
          id: brainstorm.id
        }
      };
    }

    if (isPatch) {
      this.data.id = brainstormTopic.id.toString();
    }
  }
}
