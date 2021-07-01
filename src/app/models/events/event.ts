import { environment } from '../../../environments/environment';

import { Source } from '../source';
import { Month } from '../month';
import { Era } from '../era';
import { EventNote } from './event-note';
import {EventTimeline} from './event-timeline';

export class Event {
  id: number;
  label: string;
  image: string;
  description: string;
  startDay: number;
  startMonth: Month;
  startYear: number;
  formattedStartYear: string;
  formattedStartDate: string;
  startEra: Era;
  endDay: number;
  endMonth: Month;
  endYear: number;
  formattedEndYear: string;
  formattedEndDate: string;
  endEra: Era;
  source: Source;
  notes: EventNote[];
  colorClass: string;
  eventTimelines: EventTimeline[];

  timelineStartLocation: number;
  timelineEndLocation: number;
  listEventIsHighlighted: boolean;
  timelineEventIsHighlighted: boolean;
  isSinglePointEvent: boolean;

  eventLength: number;

  defaultImage: string;

  initializeNewEvent() {
    this.defaultImage = 'https://s3.us-east-2.amazonaws.com/' + environment.s3Bucket + '/history_default.png';

    this.label = '';
    this.image = this.defaultImage;
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
    this.source = new Source();

    this.timelineStartLocation = null;
    this.listEventIsHighlighted = false;
    this.timelineEventIsHighlighted = false;
    this.isSinglePointEvent = false;

    this.eventLength = 1;
  }

  mapEvent(event) {
    const self = this;

    const startMonth = new Month();
    const startEra = new Era();

    const endMonth = new Month();
    const endEra = new Era();

    const newSource = new Source();

    startMonth.initializeNewMonth();
    endMonth.initializeNewMonth();

    startEra.initializeNewEra();
    endEra.initializeNewEra();

    newSource.initializeSource();

    self.id = event.id;
    self.label = event.attributes.label;

    if (event.attributes.image) {
      self.image = event.attributes.image;
    }

    if (event.attributes.event_start_year) {
      self.startYear = event.attributes.event_start_year;
    }

    if (event.attributes.event_start_era) {
      startEra.mapEra(event.attributes.event_start_era.data);

      this.startEra = startEra;
    }

    // optional fields
    if (event.attributes.description) {
      self.description = event.attributes.description;
    }

    if (event.attributes.event_start_day) {
      self.startDay = event.attributes.event_start_day;
    }

    if (event.attributes.event_start_month) {
      startMonth.mapMonth(event.attributes.event_start_month.data);

      self.startMonth = startMonth;
    }

    if (event.attributes.event_end_day) {
      self.endDay = event.attributes.event_end_day;
    }

    if (event.attributes.event_end_month) {
      endMonth.mapMonth(event.attributes.event_end_month.data);

      this.endMonth = endMonth;
    }

    if (event.attributes.event_end_year) {
      self.endYear = event.attributes.event_end_year;
    }

    if (event.attributes.event_end_era) {
      endEra.mapEra(event.attributes.event_end_era.data);

      this.endEra = endEra;
    }

    if (event.attributes.reference) {
      self.source = newSource.mapSource(event.attributes.reference.data);
    }

    if (event.attributes.event_note && event.attributes.event_note.data.length) {
      self.notes = [];

      for (const returnedNote of event.attributes.event_note.data) {
        const note: EventNote = new EventNote();
        note.initializeNote();
        note.mapNote(returnedNote);

        self.notes.push(note);
      }
    }

    if (self.endYear === self.startYear) {
      self.isSinglePointEvent = true;
    }

    this.setEventLength();
    this.formatYears();
    this.formatDates();
  }

  // in the case that an event has no month and the year is greater than 999,999 the formatter will shorten with 'MYA' or 'BYA'
  public formatYears() {
    // START DATE FORMATTED YEAR
    let formattedNumber: number = this.startYear;
    let postfix = '';

    let addBC = this.startEra.label === 'BC';

    if (formattedNumber < 0) {
      formattedNumber = formattedNumber * -1;
    }

    if (addBC && (!this.startMonth || !this.startMonth.label)) {
      if (formattedNumber > 999999 && formattedNumber < 1000000000) {
        formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000));
        formattedNumber = Math.round(100 * formattedNumber) / 100;
        postfix = 'MYA';

      } else if (formattedNumber > 999999999 && formattedNumber < 1000000000000) {
        formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000000));
        formattedNumber = Math.round(100 * formattedNumber) / 100;
        postfix = 'BYA';

      } else {
        if (addBC) {
          postfix = 'BC';
        }
      }
    }

    if (formattedNumber) {
      this.formattedStartYear = formattedNumber.toString() + ' ' + postfix;
    }

    // END DATE FORMATTED YEAR
    if (this.endYear) {
      formattedNumber = this.endYear;

      addBC = this.endEra.label === 'BC';

      if (formattedNumber < 0) {
        formattedNumber = formattedNumber * -1;
      }

      if (addBC && (!this.startMonth || !this.startMonth.label)) {
        if (formattedNumber > 999999 && formattedNumber < 1000000000) {
          formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000));
          formattedNumber = Math.round(100 * formattedNumber) / 100;
          postfix = 'MYA';

        } else if (formattedNumber > 999999999 && formattedNumber < 1000000000000) {
          formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000000));
          formattedNumber = Math.round(100 * formattedNumber) / 100;
          postfix = 'BYA';

        } else {
          if (addBC) {
            postfix = 'BC';
          }
        }
      }

      if (formattedNumber) {
        this.formattedEndYear = formattedNumber.toString() + ' ' + postfix;
      }

    } else {
      this.formattedEndYear = 'present';
    }
  }

  public formatDates() {
    // in the case of BC dates format to year only
    if (this.startEra.label === 'BC') {
      this.formattedStartDate = this.formattedStartYear;
    }

    if (this.endEra && this.endEra.label === 'BC') {
      this.formattedEndDate = this.formattedEndYear;
    }

    // in the case of AD dates format to normal date string if it exists
    if (this.startEra.label === 'AD') {
      let startDate = '';

      if (this.startMonth && this.startMonth.label) {
        startDate = startDate + this.startMonth.label + ' ';
      }

      if (this.startDay) {
        startDate = startDate + this.startDay.toString() + ', ';
      }

      this.formattedStartDate = startDate + this.formattedStartYear;
    }

    if (this.endEra && this.endEra.label === 'AD') {
      let endDate = '';

      if (this.endMonth && this.endMonth.label) {
        endDate = endDate + this.endMonth.label + ' ';
      }

      if (this.endDay) {
        endDate = endDate + this.endDay.toString() + ', ';
      }

      this.formattedEndDate = endDate + this.formattedEndYear;
    }

    if (!this.endEra) {
      this.formattedEndDate = 'present';
    }
  }

  setEventLength() {
    if (this.endYear) {
      this.eventLength = (this.endYear - this.startYear);
    } else {
      const dateObj = new Date();
      this.eventLength = (dateObj.getFullYear() - this.startYear);
    }

    if (this.eventLength < 0) {
      this.eventLength = this.eventLength * -1;
    }
  }
}
