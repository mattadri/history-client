import {Event} from './event';

export class EssayEvent {
  id: number;
  event: Event;

  initializeNewEssayEvent() {
    this.id = null;
    this.event = new Event();
  }

  mapEssayEvent(essayEvent) {
    this.id = essayEvent.id;

    this.event = new Event();
    this.event.mapEvent(essayEvent.attributes.event.data);
  }
}
