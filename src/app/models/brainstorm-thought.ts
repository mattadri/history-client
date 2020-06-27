import {Source} from './source';

export class BrainstormThought {
  id: number;
  thought: string;
  position: number;

  source: Source;
  page: number;
  chapter: string;

  topicId: number;
  brainstormId: number;

  initializeNewThought() {
    this.thought = '';
    this.position = null;

    this.source = new Source();
    this.source.initializeSource();

    this.page = null;
    this.chapter = null;

    this.topicId = null;
    this.brainstormId = null;
  }

  mapThought(thought) {
    this.id = thought.id;

    this.thought = thought.attributes.thought;
    this.position = thought.attributes.position;

    if (thought.attributes.reference) {
      this.source = this.source.mapSource(thought.attributes.reference.data);
    } else {
      this.source = null;
    }

    if (thought.attributes.page) {
      this.page = thought.attributes.page;
    }

    if (thought.attributes.chapter) {
      this.chapter = thought.attributes.chapter;
    }

    if (thought.attributes.brainstorm_topic_fk) {
      this.topicId = thought.attributes.brainstorm_topic_fk;
    }
  }
}
