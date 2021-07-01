import { environment } from '../../environments/environment';

import {BrainstormTopic} from './brainstorm-topic';
import {BrainstormThought} from './brainstorm-thought';
import {User} from './user';

export class Brainstorm {
  id: number;
  title: string;
  description: string;
  image: string;

  topics: BrainstormTopic[];
  thoughts: BrainstormThought[];

  users: User[];

  initializeNewBrainstorm() {
    this.title = '';
    this.description = '';
    this.image = 'https://s3.us-east-2.amazonaws.com/' + environment.s3Bucket + '/brainstorm-default.png';
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
