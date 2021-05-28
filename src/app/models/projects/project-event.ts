import {Event} from '../events/event';

export class ProjectEvent {
  id: number;

  event: Event;

  mapProjectEvent(projectEvent) {
    this.id = projectEvent.id;

    this.event = new Event();
    this.event.initializeNewEvent();
    this.event.mapEvent(projectEvent.attributes.event.data);
  }

  initializeNewProjectEvent() {
    this.event = new Event();
  }
}
