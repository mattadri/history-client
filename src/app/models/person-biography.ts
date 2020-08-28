import {Essay} from './essay';

export class PersonBiography {
  id: number;
  biography: Essay;

  initializeBiography() {
    this.biography = new Essay();
    this.biography.initializeNewEssay();
  }

  mapBiography(biography) {
    this.id = biography.id;

    const essay: Essay = new Essay();
    essay.initializeNewEssay();

    this.biography = essay.mapEssay(biography.attributes.essay.data);

    return this;
  }
}
