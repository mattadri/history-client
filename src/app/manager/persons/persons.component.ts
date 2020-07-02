import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {MatDialog} from '@angular/material';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {QuickPersonComponent} from './quick-person/quick-person.component';

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

  public filterQuery: string;

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

  public searchPeople: Person[] = [];
  public peopleLastNameAutocompleteControl = new FormControl();
  public peopleFirstNameAutocompleteControl = new FormControl();
  public peopleLastNameFilteredOptions: Observable<Person[]>;
  public peopleFirstNameFilteredOptions: Observable<Person[]>;
  public personFieldDisplayValue: string;

  public personLink: string;

  constructor(private personService: PersonService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              private timelineService: TimelineService,
              public dialog: MatDialog) {

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

    this.personService.getApiPersons('/persons?page[size]=0&fields[person]=first_name,last_name&sort=last_name', null, null, false)
      .subscribe(response => {

      this.searchPeople = response.persons;

      this.peopleLastNameFilteredOptions = this.peopleLastNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(person => this._filterPeopleLastName(person))
      );

      this.peopleFirstNameFilteredOptions = this.peopleFirstNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(person => this._filterPeopleFirstName(person))
      );
    });

    this.timelineService.getApiTimelines('/timelines?sort=modified&fields[timeline]=label').subscribe(response => {
      for (const timeline of response.timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();
    });

    this.getPersons('/persons?sort=-created&page%5Bnumber%5D=1', null, null);
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

  getPersons(path, filterTerm, dateFilter) {
    this.personService.getApiPersons(path, filterTerm, dateFilter, false).subscribe(response => {
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

  createPerson() {
    const dialogRef = this.dialog.open(QuickPersonComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(person => {
      if (person) {
        this.personService.createApiPerson(person).subscribe(response => {
          person.id = response.data.id;

          person.formatYears();

          this.personService.setPerson(person);

          this.persons.unshift(person);
        });
      }
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

  savePersonLastName(value) {
    if (value) {
      this.person.lastName = value;
    } else {
      this.person.lastName = this.peopleLastNameAutocompleteControl.value;
    }
  }

  savePersonFirstName(value) {
    if (value) {
      this.person.firstName = value;
    } else {
      this.person.firstName = this.peopleFirstNameAutocompleteControl.value;
    }
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

  displayPerson(person: Person) {
    if (person) {
      this.personFieldDisplayValue = '';

      if (person.firstName) {
        this.personFieldDisplayValue = person.firstName + ' ';
      }

      if (person.lastName) {
        this.personFieldDisplayValue += person.lastName;
      }
    }

    return this.personFieldDisplayValue;
  }

  removePerson(sideNav) {
    this.personService.removeApiPerson(this.person).subscribe(() => {
      this.personService.removePerson(this.person);

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

    this.personLink = this.person.id.toString();

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
      this.getPersons(this.previousPage, null, null);
    } else if (person.pageIndex > person.previousPageIndex) {
      this.getPersons(this.nextPage, null, null);
    }
  }

  filterResults() {
    const dateFilter = [];
    let stringFilter = '';

    if (this.filterQuery.split('-').length === 2) {
      dateFilter.push(this.filterQuery.split('-')[0]);
      dateFilter.push(this.filterQuery.split('-')[1]);

    } else if (this.filterQuery) {
      stringFilter = this.filterQuery;
    }

    this.getPersons('/persons?sort=-created', stringFilter, dateFilter);
  }

  private _filterSources(filterValue: any): Source[] {
    if (typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.sources.filter(source => {
        return source.title.toLowerCase().includes(filterValue);
      });
    }
  }

  private _filterPeopleLastName(filterValue: any): Person[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchPeople.filter(person => {
        if (person.lastName) {
          return person.lastName.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }

  private _filterPeopleFirstName(filterValue: any): Person[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchPeople.filter(person => {
        if (person.firstName) {
          return person.firstName.toLowerCase().includes(filterValue);

        } else {
          return '';
        }
      });
    }
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
