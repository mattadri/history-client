import { Reference } from './reference';
import { Month } from './month';
import { Era } from './era';
import { EventNote } from './event-note';

export class Event {
  id: number;
  label: string;
  description: string;
  startDay: number;
  startMonth: Month;
  startYear: number;
  startEra: Era;
  endDay: number;
  endMonth: Month;
  endYear: number;
  endEra: Era;
  reference: Reference;
  notes: EventNote[];

  timelineLocation: string; // if event is being loaded on a timeline this timelineStart will be populated with it's location on the timeline.

  mapEvent(event) {
    const self = this;

    const startMonth = new Month();
    const startEra = new Era();

    const endMonth = new Month();
    const endEra = new Era();

    const reference = new Reference();

    self.id = event.id;
    self.label = event.attributes.label;
    self.startYear = event.attributes.event_start_year;
    self.startEra = startEra.mapEra(event.attributes.event_start_era.data);

    // optional fields
    if (event.attributes.description) {
      self.description = event.attributes.description;
    }

    if (event.attributes.event_start_day) {
      self.startDay = event.attributes.event_start_day;
    }

    if (event.attributes.event_start_month) {
      self.startMonth = startMonth.mapMonth(event.attributes.event_start_month_rel.data);
    }

    if (event.attributes.event_end_day) {
      self.endDay = event.attributes.event_end_day;
    }

    if (event.attributes.event_end_month) {
      self.endMonth = endMonth.mapMonth(event.attributes.event_end_month.data);
    }

    if (event.attributes.event_end_year) {
      self.endYear = event.attributes.event_end_year;
    }

    if (event.attributes.event_end_era) {
      self.endEra = endEra.mapEra(event.attributes.event_end_era.data);
    }

    if (event.attributes.reference) {
      self.reference = reference.mapReference(event.attributes.reference.data);
    }

    if (event.attributes.event_note.data.length) {
      self.notes = [];

      for (const returnedNote of event.attributes.event_note.data) {
        const note: EventNote = new EventNote();

        self.notes.push(note.mapNote(returnedNote));
      }
    }
  }
}
