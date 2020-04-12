import {Person} from './person';
import {Event} from './event';

export class Category {
  id: number;
  label: string;
  singlePointEvents: Event[] = [];
  multiPointEvents: Event[] = [];
  people: Person[];
}
