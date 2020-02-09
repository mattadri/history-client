import { Reference } from '../reference';

export class ReferencePost {
  data: object;

  mapToPost(reference: Reference) {
    console.log(reference);
    this.data = {
      type: 'reference',
      attributes: {
        title: reference.title,
        published_year: reference.publishedYear,
        published_era_rel: {
          data: {
            type: 'era',
            id: reference.publishedEra.id
          }
        }
      }
    };

    // Optional fields
    if (reference.publishedDay > 0) {
      this.data.attributes.published_day = reference.publishedDay;
    }

    if (reference.publishedMonth.id) {
      this.data.attributes.published_month_rel = {
        data: {
          type: 'month',
          id: reference.publishedMonth.id
        }
      };
    }
  }
}
