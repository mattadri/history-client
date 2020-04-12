export class TimelineCategory {
  id: number;
  label: string;
  events: array;

  initializeNewTimelineCategory() {
    this.id = null;
    this.label = '';
    this.events = [];
  }

  mapTimelineCategory(category) {
    this.initializeNewTimelineCategory();

    const self = this;

    self.id = category.id;
    self.label = category.attributes.label;

    for (const returnedEvent of category.attributes.timeline_category_event.data) {
      const ids = [returnedEvent.id, returnedEvent.attributes.event.data.id];
      self.events.push(ids);
    }
  }
}
