import { environment } from '../../../environments/environment';

import {EssayNote} from './essay-note';
import {EssayReference} from './essay-reference';
import {EssayEvent} from './essay-event';
import {EssayPerson} from './essay-person';
import {EssayTimeline} from './essay-timeline';
import {EssayType} from './essay-type';
import {EssayUser} from './essay-user';

export class Essay {
  id: number;

  title: string;
  banner: string;
  abstract: string;
  essay: string;
  type: EssayType;

  essayNotes: EssayNote[];
  essayReferences: EssayReference[];
  essayEvents: EssayEvent[];
  essayPeople: EssayPerson[];
  essayTimelines: EssayTimeline[];
  essayUsers: EssayUser[];

  defaultImage: string;

  initializeNewEssay() {
    this.defaultImage = 'https://s3.us-east-2.amazonaws.com/' + environment.s3Bucket + '/essay-banner-default.png';

    this.title = '';
    this.banner = this.defaultImage;
    this.abstract = '';
    this.essay = '';

    this.essayNotes = [];
    this.essayReferences = [];
    this.essayEvents = [];
    this.essayPeople = [];
    this.essayTimelines = [];
    this.essayUsers = [];

    this.type = new EssayType();
    this.type.initializeNewEssayType();
  }

  mapEssay(essay) {
    this.id = essay.id;

    this.title = essay.attributes.title;

    if (essay.attributes.banner) {
      this.banner = essay.attributes.banner;
    }

    if (essay.attributes.abstract) {
      this.abstract = essay.attributes.abstract;
    }

    if (essay.attributes.essay) {
      this.essay = essay.attributes.essay;
    }

    if (essay.attributes.type && essay.attributes.type.data) {
      this.type.mapEssayType(essay.attributes.type.data);
    }

    // map essay notes
    if (essay.attributes.essay_note && essay.attributes.essay_note.data.length) {
      for (const note of essay.attributes.essay_note.data) {
        const newNote = new EssayNote();
        newNote.mapNote(note);

        this.essayNotes.push(newNote);
      }
    }

    // map essay sources
    if (essay.attributes.essay_reference && essay.attributes.essay_reference.data.length) {
      for (const reference of essay.attributes.essay_reference.data) {
        const newReference = new EssayReference();
        newReference.mapEssayReference(reference);

        this.essayReferences.push(newReference);
      }
    }

    // map essay events
    if (essay.attributes.essay_event && essay.attributes.essay_event.data.length) {
      for (const event of essay.attributes.essay_event.data) {
        const newEvent = new EssayEvent();
        newEvent.mapEssayEvent(event);

        this.essayEvents.push(newEvent);
      }
    }

    // map essay people
    if (essay.attributes.essay_person && essay.attributes.essay_person.data.length) {
      for (const person of essay.attributes.essay_person.data) {
        const newPerson = new EssayPerson();
        newPerson.mapEssayPerson(person);

        this.essayPeople.push(newPerson);
      }
    }

    // map essay timelines
    if (essay.attributes.essay_timeline && essay.attributes.essay_timeline.data.length) {
      for (const timeline of essay.attributes.essay_timeline.data) {
        const newTimeline = new EssayTimeline();
        newTimeline.mapEssayTimeline(timeline);

        this.essayTimelines.push(newTimeline);
      }
    }

    return this;
  }
}
