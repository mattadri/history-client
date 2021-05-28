import {Project} from '../project';

export class ProjectUserPost {
  data: any;

  mapToPost(project: Project, userId: string) {
    this.data = {
      type: 'project_user',
      attributes: {
        project_rel: {
          data: {
            type: 'project',
            id: project.id
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
