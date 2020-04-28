import {Person} from '../person';

export class PersonResponse {
  persons: Person[];
  links: any;
  total: number;
}
