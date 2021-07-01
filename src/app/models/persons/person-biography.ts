import {Essay} from '../essays/essay';
import {Person} from './person';

export class PersonBiography {
  id: number;
  biography: Essay;

  initializeNewBiography() {
    this.biography = new Essay();
    this.biography.initializeNewEssay();
  }

  mapBiography(biography, included) {
    this.id = biography.id;

    let biographyId = biography.relationships.essay_rel.data.id;
    let biographyType = biography.relationships.essay_rel.data.type;

    let returnedPersonBiography = this.objectLookup(biographyId, biographyType, included);

    const essay: Essay = new Essay();
    essay.initializeNewEssay();

    essay.mapEssay(returnedPersonBiography);

    this.biography = essay;
  }

  objectLookup(id, type, included) {
    let foundItem = null;

    for (const item of included) {
      if (item.id.toString() === id.toString() && item.type.toLowerCase() === type.toLowerCase()) {
        foundItem = item;
        break;
      }
    }

    return foundItem;
  }
}
