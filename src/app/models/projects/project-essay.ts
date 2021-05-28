import {Essay} from '../essays/essay';

export class ProjectEssay {
  id: number;

  essay: Essay;

  mapProjectEssay(projectEssay) {
    this.id = projectEssay.id;

    this.essay = new Essay();
    this.essay.initializeNewEssay();
    this.essay.mapEssay(projectEssay.attributes.essay.data);
  }

  initializeNewProjectEssay() {
    this.essay = new Essay();
  }
}
