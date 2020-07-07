import { Author } from '../author';

export class AuthorPost {
  data;

  mapToPost(author: Author, isPatch: boolean) {
    this.data = {
      type: 'author',
      attributes: {
        first_name: author.firstName,
        middle_name: author.middleName,
        last_name: author.lastName
      }
    };

    if (isPatch) {
      this.data.id = author.id;
    }
  }
}
