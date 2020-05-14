import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { Person } from '../../models/person';
import { Era } from '../../models/era';
import { Month } from '../../models/month';
import { Source } from '../../models/source';
import { Timeline } from '../../models/timeline';
import { TimelinePerson } from '../../models/timeline-person';

import { PersonService } from '../../services/person.service';
import { MonthService } from '../../services/month.service';
import { EraService } from '../../services/era.service';
import { SourceService } from '../../services/source.service';
import { TimelineService } from '../../services/timeline.service';
import {PersonNote} from '../../models/person-note';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})

export class PersonsComponent implements OnInit {
  public persons: Person[];
  public person: Person;
  public personNote: PersonNote;

  public timelines: Timeline[];
  public timeline: Timeline;
  public timelinePerson: TimelinePerson;

  public isCreatePersonMode: boolean;
  public isEditPersonMode: boolean;
  public isAddNoteMode: boolean;

  public birthMonthLabel: string;
  public deathMonthLabel: string;

  public birthEraLabel: string;
  public deathEraLabel: string;

  public eras: Era[] = [];
  public months: Month[] = [];
  public sources: Source[] = [];

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  public timelineId: number;

  public isAddTimelineMode: boolean;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  constructor(private personService: PersonService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              private timelineService: TimelineService) {
    this.persons = [];

    this.initializeNewPerson();
    this.initializeNewNote();

    this.isCreatePersonMode = false;
    this.isEditPersonMode = false;
    this.isAddTimelineMode = false;
    this.isAddNoteMode = false;

    this.eraService.getEras().subscribe(eras => {
      for (const era of eras.data) {
        this.eras.push(new Era().mapEra(era));
      }
    });

    this.monthService.getMonths().subscribe(months => {
      for (const month of months.data) {
        this.months.push(new Month().mapMonth(month));
      }
    });

    this.sourceService.getApiSources('/references?page[size]=0&fields[reference]=title,sub_title&sort=title').subscribe(sources => {
      for (const source of sources.sources) {
        this.sourceService.setSource(source);
      }

      this.sources = this.sourceService.getSources();

      this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(source => this._filterSources(source))
      );
    });

    this.timelineService.getApiTimelines('/timelines?sort=modified&fields[timeline]=label').subscribe(response => {
      for (const timeline of response.timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();
    });

    this.getPersons('/persons?sort=-created&page%5Bnumber%5D=1');
  }

  ngOnInit() { }

  initializeNewPerson() {
    this.person = new Person();

    this.person.initializeNewPerson();
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
  }

  initializeNewNote() {
    this.personNote = new PersonNote();
  }

  getPersons(path) {
    this.personService.getApiPersons(path).subscribe(response => {
      for (const person of response.persons) {
        this.personService.setPerson(person);
      }

      this.persons = this.personService.getPersons();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  activateCreateMode(sideNav) {
    this.isCreatePersonMode = true;
    this.initializeNewPerson();

    this.openPersonDetails(this.person, sideNav, true, false);
  }

  createPerson(sideNav) {
    // set the era objects
    for (const era of this.eras) {
      if (this.birthEraLabel === era.label) {
        this.person.birthEra = era;
      }
    }

    if (this.deathEraLabel) {
      for (const era of this.eras) {
        if (this.deathEraLabel === era.label) {
          this.person.deathEra = era;
        }
      }
    }

    for (const month of this.months) {
      if (this.birthMonthLabel === month.label) {
        this.person.birthMonth = month;
      }
    }

    if (this.deathMonthLabel) {
      for (const month of this.months) {
        if (this.deathMonthLabel === month.label) {
          this.person.deathMonth = month;
        }
      }
    }

    return this.personService.createApiPerson(this.person).subscribe(response => {
      this.person.id = response.data.id;

      this.personService.setPerson(this.person);

      this.isCreatePersonMode = false;

      this.closePersonDetails(sideNav);

      this.initializeNewPerson();
    });
  }

  createNote() {
    this.personService.createApiPersonNote(this.personNote, this.person).subscribe(result => {
      if (!this.person.notes) {
        this.person.notes = [];
      }

      this.personNote.id = result.data.id;
      this.person.notes.push(this.personNote);

      this.initializeNewNote();

      this.isAddNoteMode = false;
    });
  }

  createTimelinePerson() {
    for (const timeline of this.timelines) {
      if (this.timelineId === timeline.id) {
        this.timeline = timeline;
      }
    }

    this.timelinePerson = new TimelinePerson();
    this.timelinePerson.person = this.person;
    this.timelinePerson.timeline = this.timeline;

    // call service
    this.timelineService.createPersonApiTimeline(this.timelinePerson).subscribe(response => {
      if (!this.person.timelines) {
        this.person.timelines = [];
      }

      this.timelinePerson.id = response.data.id;
      this.person.timelines.push(this.timeline);

      this.initializeNewTimeline();

      this.isAddTimelineMode = false;
    });
  }

  editPerson() {
    if (!this.person.birthDay) {
      this.person.birthDay = null;
    }

    if (!this.person.deathDay) {
      this.person.deathDay = null;
    }

    if (this.birthMonthLabel === null) {
      this.person.birthMonth = new Month();
      this.person.birthMonth.label = '';
      this.person.birthMonth.id = null;
    }

    if (this.birthMonthLabel) {
      for (const month of this.months) {
        if (this.birthMonthLabel === month.label) {
          this.person.birthMonth = month;
        }
      }
    }

    if (this.deathMonthLabel === null) {
      this.person.deathMonth = new Month();
      this.person.deathMonth.label = '';
      this.person.deathMonth.id = null;
    }

    if (this.deathMonthLabel) {
      for (const month of this.months) {
        if (this.deathMonthLabel === month.label) {
          this.person.deathMonth = month;
        }
      }
    }

    for (const era of this.eras) {
      if (this.birthEraLabel === era.label) {
        this.person.birthEra = era;
      }
    }

    for (const era of this.eras) {
      if (this.deathEraLabel === era.label) {
        this.person.deathEra = era;
      }
    }

    return this.personService.patchApiPerson(this.person).subscribe(() => {
      this.isEditPersonMode = false;
    });
  }

  saveSource() {
    this.person.source = this.sourcesAutocompleteControl.value;
  }

  displaySource(source: Source) {
    if (source) {
      this.sourceFieldDisplayValue = source.title;

      if (source.subTitle) {
        this.sourceFieldDisplayValue = this.sourceFieldDisplayValue + ': ' + source.subTitle;
      }
    }

    return this.sourceFieldDisplayValue;
  }

  removePerson(sideNav) {
    this.personService.removeApiPerson(this.person).subscribe(() => {
      this.personService.removePerson(this.person);

      this.initializeNewPerson();

      this.closePersonDetails(sideNav);
    });
  }

  removeTimeline(timeline) {
    this.timelineService.removePersonApiTimeline(timeline.personId).subscribe(() => {
      for (let i = 0; i < this.person.timelines.length; i++) {
        if (this.person.timelines[i].id === timeline.id) {
          this.person.timelines.splice(i, 1);
        }
      }
    });
  }

  removeNote(note) {
    this.personService.removeApiNote(note).subscribe(() => {
      PersonService.removePersonNote(this.person, note);
    });
  }

  openPersonDetails(person, sideNav, isCreateMode, isEditMode) {
    this.person = person;

    if (!isCreateMode) {
      isCreateMode = false;
    }

    if (!isEditMode) {
      isEditMode = false;
    }

    if (this.person.birthMonth) {
      this.birthMonthLabel = this.person.birthMonth.label;
    }

    if (this.person.deathMonth) {
      this.deathMonthLabel = this.person.deathMonth.label;
    }

    this.birthEraLabel = this.person.birthEra.label;

    if (this.person.deathEra) {
      this.deathEraLabel = this.person.deathEra.label;
    }

    this.isEditPersonMode = isEditMode;
    this.isCreatePersonMode = isCreateMode;

    if (sideNav.opened) {
      sideNav.close().then(() => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

  closePersonDetails(sideNav) {
    sideNav.close();
  }

  cancelEditCreateModes(sideNav) {
    if (this.isCreatePersonMode) {
      this.closePersonDetails(sideNav);
    }

    this.isCreatePersonMode = false;
    this.isEditPersonMode = false;
  }

  cancelPersonTimelineForm() {
    this.isAddTimelineMode = false;
    this.initializeNewTimeline();
  }

  async activatePersonNoteForm() {
    this.isAddNoteMode = true;
    this.initializeNewNote();

    await this.sleep(500);

    document.getElementById('person_note').focus();
  }

  cancelPersonNoteForm() {
    this.isAddNoteMode = false;
    this.initializeNewNote();
  }

  turnPage(person) {
    if (person.pageIndex < person.previousPageIndex) {
      this.getPersons(this.previousPage);
    } else if (person.pageIndex > person.previousPageIndex) {
      this.getPersons(this.nextPage);
    }
  }

  private _filterSources(filterValue: any): Source[] {
    // when a source is actually selected the value is changed to the source itself. Do not filter if that is the case.
    if (!filterValue.id) {
      filterValue = filterValue.toLowerCase();

      return this.sources.filter(source => {
        return source.title.toLowerCase().includes(filterValue);
      });
    }
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
