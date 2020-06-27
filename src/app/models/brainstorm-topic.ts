import {BrainstormThought} from './brainstorm-thought';

export class BrainstormTopic {
  id: number;
  label: string;
  position: number;

  thoughts: BrainstormThought[];

  initializeNewTopic() {
    this.label = '';
    this.position = null;
    this.thoughts = [];
  }

  mapTopic(topic) {
    this.id = parseInt(topic.id, 10);
    this.label = topic.attributes.label;
    this.position = topic.attributes.position;

    if (topic.attributes.brainstorm_topic_thought.data.length) {
      for (const thought of topic.attributes.brainstorm_topic_thought.data) {
        const newThought = new BrainstormThought();
        newThought.initializeNewThought();
        newThought.mapThought(thought);

        this.thoughts.push(newThought);
      }
    }
  }
}
