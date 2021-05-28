import {Project} from '../project';
import {Event} from '../../events/event';

export class ProjectEventPost {
  data: any;

  mapToPost(project: Project, event: Event) {
    this.data = {
      type: 'project_event',
      attributes: {
        project_rel: {
          data: {
            type: 'project',
            id: project.id
          }
        },

        event_rel: {
          data: {
            type: 'event',
            id: event.id
          }
        }
      }
    };
  }
}
