import {Timeline} from '../timeline';

export class TimelineUserPost {
  data: any;

  mapToPost(timeline: Timeline, userId: string) {
    this.data = {
      type: 'timeline_user',
      attributes: {
        timeline_rel: {
          data: {
            type: 'timeline',
            id: timeline.id
          }
        },

        user_rel: {
          data: {
            type: 'user',
            id: userId
          }
        }
      }
    };
  }
}
