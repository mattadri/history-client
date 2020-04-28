import { Author } from '../author';

export class AuthorPost {
  data;

  mapToPost(author: Author, isPatch: boolean) {
    this.data = {
      type: 'author',
      attributes: {
        first_name: author.firstName
      }
    };

    if (author.middleName) {
      this.data.attributes.middle_name = author.middleName;
    }

    if (author.lastName) {
      this.data.attributes.last_name = author.lastName;
    }

    if (isPatch) {
      this.data.id = author.id;
    }
  }
}
