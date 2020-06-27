import {BrainstormTopic} from '../brainstorm-topic';

export class BrainstormTopicPost {
  data;

  mapToPost(brainstormTopic: BrainstormTopic, isPatch: boolean) {
    this.data = {
      type: 'brainstorm_topic',
      attributes: {
        label: brainstormTopic.label,
        position: brainstormTopic.position
      }
    };

    if (isPatch) {
      this.data.id = brainstormTopic.id.toString();
    }
  }
}
