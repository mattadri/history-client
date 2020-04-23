import { Event } from '../event';

export class EventPost {
  data: object;

  mapToPost(event: Event, isPatch: boolean) {
    this.data = {
      type: 'event',
      attributes: {
        label: event.label,
        event_start_year: event.startYear,
        event_start_era_rel: {
          data: {
            type: 'era',
            id: event.startEra.id
          }
        }
      }
    };

    // optional fields
    if (event.description) {
      this.data.attributes.description = event.description;
    }

    if (event.startDay) {
      this.data.attributes.event_start_day = event.startDay;
    }

    if (event.startMonth && event.startMonth.id) {
      this.data.attributes.event_start_month_rel = {
        data: {
          type: 'month',
          id: event.startMonth.id
        }
      };
    }

    if (event.endDay) {
      this.data.attributes.event_end_day = event.endDay;
    }

    if (event.endMonth && event.endMonth.id) {
      this.data.attributes.event_end_month_rel = {
        data: {
          type: 'month',
          id: event.endMonth.id
        }
      };
    }

    if (event.endYear) {
      this.data.attributes.event_end_year = event.endYear;
    }

    if (event.endEra.id) {
      this.data.attributes.event_end_era_rel = {
        data: {
          type: 'era',
          id: event.endEra.id
        }
      };
    }

    if (event.source) {
      this.data.attributes.reference_rel = {
        data: {
          type: 'reference',
          id: event.source.id
        }
      };
    }

    if (isPatch) {
      this.data.id = event.id;
    }
  }
}
