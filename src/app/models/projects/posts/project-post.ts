import {Project} from '../project';

export class ProjectPost {
  data;

  mapToPost(project: Project, isPatch: boolean) {
    this.data = {
      type: 'project',
      attributes: {
        label: project.label
      }
    };

    if (isPatch) {
      this.data.id = project.id;
    }
  }
}
