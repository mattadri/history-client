import { Author } from './author';
import { Month } from './month';
import { Era } from './era';
import { SourceNote } from './source-note';

export class Source {
  id: number;
  title: string;
  subTitle: string;
  publishedDay: number;
  publishedMonth: Month;
  publishedYear: number;
  publishedEra: Era;
  authors: Author[];
  notes: SourceNote[];

  formattedPublishedDate: string;

  // Api uses JsonAPI protocol. This maps that standard to this Angular Model
  mapSource(source) {
    const month = new Month();
    const era = new Era();

    const self = this;

    self.id = source.id;
    self.title = source.attributes.title;

    if (source.attributes.published_year) {
      self.publishedYear = source.attributes.published_year;
    }

    if (source.attributes.published_era) {
      self.publishedEra = era.mapEra(source.attributes.published_era.data);
    }

    // optional fields
    if (source.attributes.sub_title) {
      self.subTitle = source.attributes.sub_title;
    }

    if (source.attributes.published_day) {
      self.publishedDay = source.attributes.published_day;
    }

    if (source.attributes.published_month) {
      self.publishedMonth = month.mapMonth(source.attributes.published_month.data);
    }

    self.authors = [];

    if (source.attributes.reference_author && source.attributes.reference_author.data.length) {
      for (const sourceAuthor of source.attributes.reference_author.data) {
        const author = new Author();

        author.mapAuthor(sourceAuthor.attributes.author.data, sourceAuthor.id);

        this.authors.push(author);
      }
    }

    self.notes = [];

    if (source.attributes.reference_note && source.attributes.reference_note.data.length) {
      for (const sourceNote of source.attributes.reference_note.data) {
        const note = new SourceNote();
        note.initializeNote();

        note.mapNote(sourceNote);

        this.notes.push(note);
      }
    }

    this.formatPublishedDate();

    return self;
  }

  initializeSource() {
    this.title = '';
    this.subTitle = '';
    this.publishedDay = null;
    this.publishedMonth = new Month();
    this.publishedYear = null;
    this.publishedEra = new Era();
    this.authors = [];
    this.notes = [];

    this.formattedPublishedDate = '';
  }

  formatPublishedDate() {
    this.formattedPublishedDate = '';

    if (this.publishedMonth && this.publishedMonth.label) {
      this.formattedPublishedDate += this.publishedMonth.label;

      if (this.publishedDay) {
        this.formattedPublishedDate += ' ' + this.publishedDay.toString() + ', ' + this.publishedYear.toString();
      } else {
        this.formattedPublishedDate += ' ' + this.publishedYear.toString();
      }
    } else {
      if (this.publishedYear) {
        this.formattedPublishedDate += this.publishedYear.toString();
      }
    }
  }
}
