import { Source } from '../source';
import { Author } from '../author';

export class SourceAuthorPost {
  data: object;

  mapToPost(source: Source, author: Author) {
    this.data = {
      type: 'reference_author',
      attributes: {
        reference_rel: {
          data: {
            type: 'reference',
            id: source.id
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
