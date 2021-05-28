import {Person} from '../persons/person';
import {PersonTimeline} from '../persons/person-timeline';
import {PersonBiography} from '../persons/person-biography';

export class PersonResponse {
  persons: Person[];
  links: any;
  total: number;
}

export class PersonTimelinesResponse {
  personTimelines: PersonTimeline[];
  links: any;
  total: number;
}

export class PersonBiographiesResponse {
  personBiographies: PersonBiography[];
  links: any;
  total: number;
}
