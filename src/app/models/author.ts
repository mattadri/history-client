export class Author {
  id: number;
  relationshipId: number;
  firstName: string;
  middleName: string;
  lastName: string;

  // author: the response author data object
  // relationshipId: the author/reference relationship id that IDs the author to a specific relationship

  mapAuthor(author, relationshipId) {
    // relationship ID will only be passed if author object is being looked up on a specific reference. Check if unidentified.
    if (!relationshipId) {
      relationshipId = 0;
    }

    this.id = author.id;
    this.relationshipId = relationshipId;
    this.firstName = author.attributes.first_name;
    this.middleName = author.attributes.middle_name;
    this.lastName = author.attributes.last_name;
  }

  initializeAuthor() {
    this.firstName = '';
    this.middleName = '';
    this.lastName = '';
  }
}
