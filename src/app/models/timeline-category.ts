export class TimelineCategory {
  id: number;
  label: string;
  events: Array<any>;
  people: Array<any>;

  initializeNewTimelineCategory() {
    this.id = null;
    this.label = '';
    this.events = [];
    this.people = [];
  }

  mapTimelineCategory(category) {
    this.initializeNewTimelineCategory();

    const self = this;

    self.id = category.id;
    self.label = category.attributes.label;

    for (const returnedEvent of category.attributes.timeline_category_event.data) {
      // console.log('Category Event ID: ', returnedEvent.id);
      // console.log('Event ID: ', returnedEvent.attributes.event.data.id);
      const ids = [returnedEvent.id, returnedEvent.attributes.event.data.id];
      self.events.push(ids);
    }
  }
}
