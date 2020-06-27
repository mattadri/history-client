import {BrainstormTopic} from './brainstorm-topic';
import {BrainstormThought} from './brainstorm-thought';

export class Brainstorm {
  id: number;
  title: string;
  description: string;

  topics: BrainstormTopic[];
  thoughts: BrainstormThought[];

  initializeNewBrainstorm() {
    this.title = '';
    this.description = '';
    this.topics = [];
    this.thoughts = [];
  }

  mapBrainstorm(brainstorm) {
    this.id = brainstorm.id;

    this.title = brainstorm.attributes.title;
    this.description = brainstorm.attributes.description;

    if (brainstorm.attributes.brainstorm_thought && brainstorm.attributes.brainstorm_thought.data.length) {
      for (const thought of brainstorm.attributes.brainstorm_thought.data) {
        const newThought = new BrainstormThought();
        newThought.initializeNewThought();
        newThought.mapThought(thought);

        this.thoughts.push(newThought);
      }
    }

    if (brainstorm.attributes.brainstorm_topic && brainstorm.attributes.brainstorm_topic.data.length) {
      for (const topic of brainstorm.attributes.brainstorm_topic.data) {
        const newTopic = new BrainstormTopic();
        newTopic.initializeNewTopic();
        newTopic.mapTopic(topic);

        this.topics.push(newTopic);
      }
    }
  }
}
