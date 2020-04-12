import { Reference } from './reference';
import { Month } from './month';
import { Era } from './era';
import { EventNote } from './event-note';
import { Timeline } from './timeline';

export class Event {
  id: number;
  label: string;
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
  reference: Reference;
  notes: EventNote[];
  timelines: Timeline[];
  colorClass: string;

  // if event is being loaded on a timeline this timelineStart will be populated with it's location on the timeline.
  timelineEventId: number;
  timelineStartLocation: string;
  timelineEndLocation: string;
  listEventIsHighlighted: boolean;
  timelineEventIsHighlighted: boolean;
  isSinglePointEvent: boolean;
  isShadow: boolean;
  priority: number;

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
    this.timelines = [];
    this.reference = new Reference();

    this.timelineStartLocation = '';
    this.listEventIsHighlighted = false;
    this.timelineEventIsHighlighted = false;
    this.isSinglePointEvent = false;
    this.isShadow = false;
    this.priority = 0;
  }

  mapEvent(event, isShadow, priority, timelineEventId) {
    /*
    isShadow: Will only be passed if this is parsing a timeline-event. This is a property mapped only in the case it is
      attached to a timeline.
    priority: Same as isShadow. Will just be null if not attached to a timeline.
     */
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
    self.isShadow = isShadow;
    self.priority = priority;
    self.timelineEventId = timelineEventId;

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

    if (event.attributes.timeline_event.data.length) {
      self.timelines = [];

      for (const returnedTimeline of event.attributes.timeline_event.data) {
        const timeline: Timeline = new Timeline();

        timeline.mapTimeline(returnedTimeline.attributes.timeline.data, returnedTimeline.id);

        self.timelines.push(timeline);
      }
    }
  }

  // in the case that an event has no month and the year is greater than 999,999 the formatter will shorten with 'MYA' or 'BYA'
  public formatYears() {
    // START DATE FORMATTED YEAR
    let formattedNumber = this.startYear;
    let addBC = false;

    if (formattedNumber < 0) {
      addBC = true;
      formattedNumber = formattedNumber * -1;
    }

    if (this.startEra && this.startEra.label === 'BC' && !this.startMonth) {
      if (formattedNumber > 999999 && formattedNumber < 1000000000) {
        formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000).toFixed(2)) + ' MYA';
      } else if (formattedNumber > 999999999 && formattedNumber < 1000000000000) {
        formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000000).toFixed(2)) + ' BYA';
      } else {
        if (addBC) {
          formattedNumber = formattedNumber.toString() + ' BC';
        }
      }
    }

    if (formattedNumber) {
      this.formattedStartYear = formattedNumber.toString();
    }

    // END DATE FORMATTED YEAR
    if (this.endYear) {
      formattedNumber = this.endYear;
      addBC = false;

      if (formattedNumber < 0) {
        addBC = true;
        formattedNumber = formattedNumber * -1;
      }

      if (this.endEra && this.endEra.label === 'BC' && !this.endMonth) {
        if (formattedNumber > 999999 && formattedNumber < 1000000000) {
          formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000).toFixed(2)) + ' MYA';
        } else if (formattedNumber > 999999999 && formattedNumber < 1000000000000) {
          formattedNumber = Math.sign(formattedNumber) * ((Math.abs(formattedNumber) / 1000000000).toFixed(2)) + ' BYA';
        } else {
          if (addBC) {
            formattedNumber = formattedNumber.toString() + ' BC';
          }
        }
      }

      if (formattedNumber) {
        this.formattedEndYear = formattedNumber.toString();
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

      if (this.startMonth) {
        startDate = startDate + this.startMonth.label + ' ';
      }

      if (this.startDay) {
        startDate = startDate + this.startDay.toString() + ', ';
      }

      this.formattedStartDate = startDate + this.formattedStartYear;
    }

    if (this.endEra && this.endEra.label === 'AD') {
      let endDate = '';

      if (this.endMonth) {
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
}
