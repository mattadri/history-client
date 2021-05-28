import {Person} from './persons/person';
import {Event} from './events/event';

export class Category {
  id: number;
  label: string;
  singlePointEvents: Event[] = [];
  multiPointEvents: Event[] = [];
  people: Person[];
}
