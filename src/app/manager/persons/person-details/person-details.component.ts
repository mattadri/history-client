import { Component, OnInit } from '@angular/core';

import {map, startWith} from 'rxjs/operators';

import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Source} from '../../../models/source';
import {Month} from '../../../models/month';
import {Era} from '../../../models/era';
import {Timeline} from '../../../models/timeline';
import {TimelineService} from '../../../services/timeline.service';
import {SourceService} from '../../../services/source.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';
import {Person} from '../../../models/person';
import {PersonNote} from '../../../models/person-note';
import {TimelinePerson} from '../../../models/timeline-person';
import {PersonService} from '../../../services/person.service';
import {PersonBiography} from '../../../models/person-biography';
import {EssayService} from '../../../services/essay.service';
import {Essay} from '../../../models/essay';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  public person: Person;
  public note: PersonNote;
  public timeline: Timeline;
  public timelinePerson: TimelinePerson;
  public biography: Essay;
  public personBiography: PersonBiography;
  public availableBiographies: Essay[];

  public sources: Source[] = [];
  public timelines: Timeline[] = [];

  public eras: Era[] = [];
  public months: Month[] = [];

  public isAddNoteMode: boolean;
  public isAddTimelineMode: boolean;
  public isAddBiographyMode: boolean;
  public isEditPersonMode: boolean;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  public searchPersons: Person[] = [];

  public personFirstNameAutocompleteControl = new FormControl();
  public personFirstNameFilteredOptions: Observable<Person[]>;
  public personFirstNameFieldDisplayValue: string;

  public personLastNameAutocompleteControl = new FormControl();
  public personLastNameFilteredOptions: Observable<Person[]>;
  public personLastNameFieldDisplayValue: string;

  constructor(private route: ActivatedRoute,
              private personService: PersonService,
              private timelineService: TimelineService,
              private sourceService: SourceService,
              private essayService: EssayService,
              private eraService: EraService,
              private monthService: MonthService) {

    const personId = this.route.snapshot.paramMap.get('id');

    this.personService.getApiPerson(personId).subscribe(person => {
      this.person = person;

      if (!this.person.description.length) {
        this.person.description = 'This person needs a description.';
      }

      this.personService.setPerson(this.person);

      this.sourcesAutocompleteControl.setValue(this.person.source);

      // LOAD REMAINING DATA AFTER THE INITIAL PERSON HAS BEEN RETRIEVED
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

      this.essayService.getApiEssays(
        '/essays?fields[essay]=title,type&filter=[{"name": "type_rel", "op": "has", "val": ' +
        '{"name": "label", "op": "eq", "val": "Biography"}}]').subscribe((response) => {

        this.availableBiographies = response.essays;
      });

      this.personService.getApiPersons('/persons?page[size]=0&fields[person]=first_name,last_name&sort=last_name', null, null, false)
      .subscribe(response => {
        this.searchPersons = response.persons;

        this.personFirstNameFilteredOptions = this.personFirstNameAutocompleteControl.valueChanges.pipe(
          startWith(''),
          map(filteredPerson => this._filterPersonsFirstName(filteredPerson))
        );

        this.personLastNameFilteredOptions = this.personLastNameAutocompleteControl.valueChanges.pipe(
          startWith(''),
          map(filteredPerson => this._filterPersonsLastName(filteredPerson))
        );
      });

      this.timelineService.getApiTimelines('/timelines?sort=modified&fields[timeline]=label').subscribe(response => {
        for (const timeline of response.timelines) {
          this.timelineService.setTimeline(timeline);
        }

        this.timelines = this.timelineService.getTimelines();
      });
    });

    this.isEditPersonMode = false;
    this.isAddNoteMode = false;
    this.isAddTimelineMode = false;
    this.isAddBiographyMode = false;
  }

  ngOnInit() { }

  initializeNewNote() {
    this.note = new PersonNote();
    this.note.initializeNote();
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();
  }

  selectEra(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }

  selectMonth(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }

  activateEditPersonMode() {
    this.isEditPersonMode = true;
  }

  activateAddNoteMode() {
    this.isAddNoteMode = true;

    this.initializeNewNote();
  }

  activateAddTimelineMode() {
    this.isAddTimelineMode = true;
  }

  activateAddBiographyMode() {
    this.isAddBiographyMode = true;
  }

  deactivateEditPersonMode() {
    this.isEditPersonMode = false;
  }

  deactivateAddNoteMode() {
    this.isAddNoteMode = false;
  }

  deactivateAddTimelineMode() {
    this.isAddTimelineMode = false;
  }

  deactivateAddBiographyMode() {
    this.isAddBiographyMode = false;
  }

  savePersonFirstName(value) {
    if (value) {
      this.person.firstName = value;
    } else {
      this.person.firstName = this.personFirstNameAutocompleteControl.value;
    }
  }

  savePersonLastName(value) {
    if (value) {
      this.person.lastName = value;
    } else {
      this.person.lastName = this.personFirstNameAutocompleteControl.value;
    }
  }

  saveDescription(content) {
    this.person.description = content;

    this.editPerson();
  }

  editPerson() {
    return this.personService.patchApiPerson(this.person).subscribe(() => {
      this.isEditPersonMode = false;

      this.person.formatBirthAndDeath();
      this.person.setAge();
    });
  }

  saveTimelinePerson() {
    this.timelinePerson = new TimelinePerson();
    this.timelinePerson.person = this.person;
    this.timelinePerson.timeline = this.timeline;

    this.timelineService.createPersonApiTimeline(this.timelinePerson).subscribe(response => {
      this.timelinePerson.id = response.data.id;
      this.timeline.personId = this.timelinePerson.id;

      this.person.timelines.push(this.timeline);

      this.initializeNewTimeline();

      this.deactivateAddTimelineMode();
    });
  }

  saveBiography() {
    this.personService.createPersonBiography(this.person, this.biography).subscribe(response => {
      this.personBiography = new PersonBiography();
      this.personBiography.id = response.data.id;
      this.personBiography.biography = this.biography;

      this.person.biographies.push(this.personBiography);

      this.deactivateAddBiographyMode();
    });
  }

  saveNote() {
    this.personService.createApiPersonNote(this.note, this.person).subscribe(response => {
      this.note.id = response.data.id;
      this.person.notes.push(this.note);

      this.initializeNewNote();

      this.deactivateAddNoteMode();
    });
  }

  deleteNote(note: PersonNote) {
    this.personService.removeApiNote(note).subscribe(() => {
      PersonService.removePersonNote(this.person, note);
    });
  }

  deleteTimeline(timeline) {
    this.timelineService.removePersonApiTimeline(timeline.personId).subscribe(() => {
      for (let i = 0; i < this.person.timelines.length; i++) {
        if (this.person.timelines[i].id === timeline.id) {
          this.person.timelines.splice(i, 1);
        }
      }
    });
  }

  deleteBiography(biography) {
    this.personService.removeApiPersonBiography(biography).subscribe(() => {
      for (let i = 0; i < this.person.biographies.length; i++) {
        if (this.person.biographies[i].id === biography.id) {
          this.person.biographies.splice(i, 1);
        }
      }
    });
  }

  displayPersonFirstName(person: Person) {
    if (person) {
      this.personFirstNameFieldDisplayValue = '';

      if (person.firstName) {
        this.personFirstNameFieldDisplayValue = person.firstName;
      }
    }

    return this.personFirstNameFieldDisplayValue;
  }

  displayPersonLastName(person: Person) {
    if (person) {
      this.personLastNameFieldDisplayValue = '';

      if (person.lastName) {
        this.personLastNameFieldDisplayValue = person.lastName;
      }
    }

    return this.personLastNameFieldDisplayValue;
  }

  private _filterPersonsFirstName(filterValue: any): Person[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchPersons.filter(person => {
        if (person.firstName) {
          return person.firstName.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }

  private _filterPersonsLastName(filterValue: any): Person[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchPersons.filter(person => {
        if (person.lastName) {
          return person.lastName.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }
}
