import {Timeline} from '../../timelines/timeline';
import {Project} from '../project';

export class ProjectTimelinePost {
  data: any;

  mapToPost(project: Project, timeline: Timeline) {
    this.data = {
      type: 'project_timeline',
      attributes: {
        project_rel: {
          data: {
            type: 'project',
            id: project.id
          }
        },

        timeline_rel: {
          data: {
            type: 'timeline',
            id: timeline.id
          }
        }
      }
    };
  }
}
