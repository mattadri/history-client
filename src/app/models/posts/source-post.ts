import { Source } from '../source';

export class SourcePost {
  data: object;

  mapToPost(source: Source, isPatch: boolean) {
    this.data = {
      type: 'reference',
      attributes: {
        title: source.title,
        published_year: source.publishedYear,
        published_era_rel: {
          data: {
            type: 'era',
            id: source.publishedEra.id
          }
        }
      }
    };

    // Optional fields
    if (source.subTitle) {
      this.data.attributes.sub_title = source.subTitle;
    }

    if (source.publishedDay) {
      this.data.attributes.published_day = source.publishedDay;
    }

    if (source.publishedMonth && source.publishedMonth.id) {
      this.data.attributes.published_month_rel = {
        data: {
          type: 'month',
          id: source.publishedMonth.id
        }
      };
    }

    if (isPatch) {
      this.data.id = source.id;
    }
  }
}
