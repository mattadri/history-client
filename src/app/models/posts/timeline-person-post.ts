import {PersonTimeline} from '../persons/person-timeline';

export class TimelinePersonPost {
  data;

  mapToPost(personTimeline: PersonTimeline, isPatch: boolean) {
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
            id: personTimeline.person.id
          }
        }
      }
    };

    if (isPatch) {
      this.data.id = personTimeline.id;
    }
  }
}
