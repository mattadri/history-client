import {PersonTimeline} from '../persons/person-timeline';
import {Person} from '../persons/person';

export class TimelinePersonPost {
  data;

  mapToPost(personTimeline: PersonTimeline, person: Person, isPatch: boolean) {
    this.data = {
      type: 'timeline_person',
      attributes: {
        timeline_rel: {
          data: {
            type: 'timeline',
            id: personTimeline.timeline.id
          }
        },
        person_rel: {
          data: {
            type: 'person',
            id: person.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = personTimeline.id;
    }
  }
}
