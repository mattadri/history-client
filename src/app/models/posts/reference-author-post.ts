import { Reference } from '../reference';
import { Author } from '../author';

export class ReferenceAuthorPost {
  data: object;

  mapToPost(reference: Reference, author: Author) {
    this.data = {
      type: 'reference_author',
      attributes: {
        reference_rel: {
          data: {
            type: 'reference',
            id: reference.id
          }
        },
        author_rel: {
          data: {
            type: 'author',
            id: author.id
          }
        }
      }
    };
  }
}
