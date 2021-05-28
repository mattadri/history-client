import {Project} from '../project';
import {Person} from '../../persons/person';
export class ProjectPersonPost {
  data: any;

  mapToPost(project: Project, person: Person) {
    this.data = {
      type: 'project_person',
      attributes: {
        project_rel: {
          data: {
            type: 'project',
            id: project.id
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
  }
}
