import { TimelinePerson } from '../timeline-person';

export class TimelinePersonPost {
  data: object;

  mapToPost(timelinePerson: TimelinePerson, isPatch: boolean) {
    this.data = {
      type: 'timeline_person',
      attributes: {
        timeline_rel: {
          data: {
            type: 'timeline',
            id: timelinePerson.timeline.id
          }
        },
        person_rel: {
          data: {
            type: 'person',
            id: timelinePerson.person.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = timelinePerson.id;
    }
  }
}
