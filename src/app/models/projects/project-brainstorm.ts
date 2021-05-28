import {Brainstorm} from '../brainstorm';
export class ProjectBrainstorm {
  id: number;

  brainstorm: Brainstorm;

  mapProjectBrainstorm(projectBrainstorm) {
    this.id = projectBrainstorm.id;

    this.brainstorm = new Brainstorm();
    this.brainstorm.initializeNewBrainstorm();
    this.brainstorm.mapBrainstorm(projectBrainstorm.attributes.brainstorm.data);
  }

  initializeNewProjectBrainstorm() {
    this.brainstorm = new Brainstorm();
  }
}
