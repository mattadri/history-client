import { Author } from './author';
import { Month } from './month';
import { Era } from './era';

export class Reference {
  id: number;
  title: string;
  subTitle: string;
  publishedDay: number;
  publishedMonth: Month;
  publishedYear: number;
  publishedEra: Era;
  authors: Author[];

  // Api uses JsonAPI protocol. This maps that standard to this Angular Model
  mapReference(reference) {
    const month = new Month();
    const era = new Era();

    const self = this;

    self.id = reference.id;
    self.title = reference.attributes.title;
    self.publishedYear = reference.attributes.published_year;
    self.publishedEra = era.mapEra(reference.attributes.published_era.data);

    // optional fields
    if (reference.attributes.sub_title) {
      self.subTitle = reference.attributes.sub_title;
    }

    if (reference.attributes.published_day) {
      self.publishedDay = reference.attributes.published_day;
    }

    if (reference.attributes.published_month) {
      self.publishedMonth = month.mapMonth(reference.attributes.published_month.data);
    }

    self.authors = [];

    if (reference.attributes.reference_author.data.length) {
      for (const referenceAuthor of reference.attributes.reference_author.data) {
        const author = new Author();

        author.mapAuthor(referenceAuthor.attributes.author.data, referenceAuthor.id);

        this.authors.push(author);
      }
    }

    return self;
  }

  initializeReference() {
    this.title = '';
    this.subTitle = '';
    this.publishedDay = null;
    this.publishedMonth = new Month();
    this.publishedYear = null;
    this.publishedEra = new Era();
    this.authors = [];
  }
}
