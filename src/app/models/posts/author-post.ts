import { Author } from '../author';

export class AuthorPost {
  data: object;

  mapToPost(author: Author) {
    this.data = {
      type: 'author',
      attributes: {
        first_name: author.firstName,
        middle_name: author.middleName,
        last_name: author.lastName
      }
    };
  }
}
