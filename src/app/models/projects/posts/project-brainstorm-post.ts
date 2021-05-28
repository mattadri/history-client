import {Project} from '../project';
import {Brainstorm} from '../../brainstorm';

export class ProjectBrainstormPost {
  data: any;

  mapToPost(project: Project, brainstorm: Brainstorm) {
    this.data = {
      type: 'project_brainstorm',
      attributes: {
        project_rel: {
          data: {
            type: 'project',
            id: project.id
          }
        },

        brainstorm_rel: {
          data: {
            type: 'brainstorm',
            id: brainstorm.id
          }
        }
      }
    };
  }
}
