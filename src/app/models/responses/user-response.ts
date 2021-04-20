import {User} from '../user';

export class UserResponse {
  users: User[];
  links: any;
  total: number;
}
