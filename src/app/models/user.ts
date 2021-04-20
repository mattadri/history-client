export class User {
  id: number;
  firstName: string;
  lastName: string;

  mapUser(user) {
    this.id = user.id;
    this.firstName = user.attributes.first_name;
    this.lastName = user.attributes.last_name;
  }

  initializeNewUser() {
    this.firstName = '';
    this.lastName = '';
  }
}
