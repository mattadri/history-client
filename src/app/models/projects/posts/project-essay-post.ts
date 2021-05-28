import {Essay} from '../../essays/essay';
import {Project} from '../project';

export class ProjectEssayPost {
  data: any;

  mapToPost(project: Project, essay: Essay) {
    this.data = {
      type: 'project_essay',
      attributes: {
        project_rel: {
          data: {
            type: 'project',
            id: project.id
          }
        },

        essay_rel: {
          data: {
            type: 'essay',
            id: essay.id
          }
        }
      }
    };
  }
}
