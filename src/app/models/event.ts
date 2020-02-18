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
  formattedStartYear: string;
  startEra: Era;
  endDay: number;
  endMonth: Month;
  endYear: number;
  formattedEndYear: string;
  endEra: Era;
  reference: Reference;
  notes: EventNote[];

  // if event is being loaded on a timeline this timelineStart will be populated with it's location on the timeline.
  timelineLocation: string;

  initializeNewEvent() {
    this.label = '';
    this.description = '';
    this.startDay = null;
    this.startMonth = new Month();
    this.startYear = null;
    this.startEra = new Era();
    this.endDay = null;
    this.endMonth = new Month();
    this.endYear = null;
    this.endEra = new Era();
    this.notes = [];
    this.reference = new Reference();
  }

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
      self.startMonth = startMonth.mapMonth(event.attributes.event_start_month.data);
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

  // in the case that an event has no month and the year is greater than 999,999 the formatter will shorten with 'MYA' or 'BYA'
  public formatYears(isStart, month, year, era) {
    let formattedNumber = year;

    if (era.label === 'BC' && !month) {
      if (year > 999999 && year < 1000000000) {
        formattedNumber = year.toPrecision(2).split('e')[0];

        if (formattedNumber[formattedNumber.length - 1] === '0') {
          formattedNumber = formattedNumber[0];
        }

        formattedNumber = formattedNumber + ' MYA';

      } else if (year > 999999999 && year < 1000000000000) {
        formattedNumber = year.toPrecision(2).split('e')[0];

        if (formattedNumber[formattedNumber.length - 1] === '0') {
          formattedNumber = formattedNumber[0];
        }

        formattedNumber = formattedNumber + ' BYA';
      }
    }

    if (isStart) {
      this.formattedStartYear = formattedNumber.toString();
    } else {
      this.formattedEndYear = formattedNumber.toString();
    }
  }
}
