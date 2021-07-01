import { Component, OnInit } from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Source} from '../../../models/source';
import {Month} from '../../../models/month';
import {Era} from '../../../models/era';
import {Timeline} from '../../../models/timelines/timeline';
import {TimelineService} from '../../../services/timeline.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';
import {Person} from '../../../models/persons/person';
import {PersonNote} from '../../../models/persons/person-note';
import {PersonService} from '../../../services/person.service';
import {PersonBiography} from '../../../models/persons/person-biography';
import {EssayService} from '../../../services/essay.service';
import {Essay} from '../../../models/essays/essay';
import {ConfirmRemovalComponent} from '../../../utilities/confirm-removal/confirm-removal.component';
import {MatDialog} from '@angular/material/dialog';
import {PersonTimeline} from '../../../models/persons/person-timeline';
import {PersonDetailsAddBiographyComponent} from './person-details-add-biography/person-details-add-biography.component';
import {UserService} from '../../../services/user.service';
import {AddExistingTimelineDialogComponent} from '../../../utilities/add-existing-timeline-dialog/add-existing-timeline-dialog.component';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
  public person: Person;
  public note: PersonNote;
  public timeline: Timeline;
  public personBiographies: PersonBiography[];
  public biography: Essay;
  public personBiography: PersonBiography;

  public sources: Source[] = [];
  public timelines: Timeline[] = [];

  public eras: Era[] = [];
  public months: Month[] = [];

  public isAddNoteMode: boolean;
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

  public isSavingImage: boolean;

  public userId: string;

  public showReturnHeader: boolean;
  public returnPath: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private personService: PersonService,
              private timelineService: TimelineService,
              private essayService: EssayService,
              private eraService: EraService,
              private userService: UserService,
              private monthService: MonthService) {

    const personId = this.route.snapshot.paramMap.get('id');

    this.userId = localStorage.getItem('user.id');

    this.personBiographies = [];

    this.isSavingImage = false;

    this.showReturnHeader = false;
    this.returnPath = '';

    this._setReturnHeader();

    this.person = this.personService.getPerson(personId);

    if (!this.person) {
      this.personService.getApiPerson(personId).subscribe(person => {
        this.person = person;

        this.personService.setPerson(this.person);

        if (!this.person.description.length) {
          this.person.description = 'This person needs a description.';
        }

        this.sourcesAutocompleteControl.setValue(this.person.source);

        // GET THE TIMELINES THE PERSON IS ATTACHED TO
        this.personService.getApiPersonTimelines(this.person).subscribe((response) => {
          this.person.personTimelines = response.personTimelines;
        });

        // GET THE BIOGRAPHIES THE PERSON IS ATTACHED TO
        this.personService.getApiPersonBiographies(this.person).subscribe((response) => {
          this.person.personBiographies = response.personBiographies;
        });
      });
    }

    this.isEditPersonMode = false;
    this.isAddNoteMode = false;
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
    this.eras = this.eraService.getCachedEras();

    if (!this.eras.length) {
      this.eraService.getEras().subscribe(eras => {
        for (const returnedEra of eras.data) {
          const era: Era = new Era();
          era.initializeNewEra();
          era.mapEra(returnedEra);

          this.eraService.setEra(era);
        }

        this.eras = this.eraService.getCachedEras();
      });
    }

    this.months = this.monthService.getCachedMonths();

    if (!this.months.length) {
      this.monthService.getMonths().subscribe(months => {
        for (const returnedMonth of months.data) {
          const month: Month = new Month();
          month.initializeNewMonth();
          month.mapMonth(returnedMonth);

          this.monthService.setMonth(month);
        }

        this.months = this.monthService.getCachedMonths();
      });
    }

    this.isEditPersonMode = true;
  }

  activateAddNoteMode() {
    this.isAddNoteMode = true;

    this.initializeNewNote();
  }

  deactivateEditPersonMode() {
    this.isEditPersonMode = false;
  }

  deactivateAddNoteMode() {
    this.isAddNoteMode = false;
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

  addTimelinePerson() {
    const dialogRef = this.dialog.open(AddExistingTimelineDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(timeline => {
      let personTimeline = new PersonTimeline();
      personTimeline.initializeNewPersonTimeline();

      personTimeline.timeline.id = timeline.id;

      this.timelineService.createPersonApiTimeline(personTimeline, this.person).subscribe(response => {
        personTimeline.id = response.data.id;
      });
    });
  }

  addPersonBiography() {
    const dialogRef = this.dialog.open(PersonDetailsAddBiographyComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(biography => {
      let personBiography = new PersonBiography();
      personBiography.initializeNewBiography();

      personBiography.biography = biography;

      this.personService.createPersonBiography(personBiography, this.person).subscribe(response => {
        personBiography.id = response.data.id;

        // get the full timeline now that we have it to show on the card. The previous timeline was a
        // truncated version for selection purposes only.
        this.essayService.getApiEssay(biography.id).subscribe(essay => {
          personBiography.biography = essay;

          this.person.personBiographies.unshift(personBiography);
        });
      });
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

  saveImage(e: File[]) {
    if (e.length) {
      this.isSavingImage = true;

      const file = e[0];
      const imageForm = new FormData();
      imageForm.append('image', file);

      this.personService.createApiPersonImage(imageForm).subscribe((personImageResponse) => {
        this.person.image = personImageResponse;

        this.personService.patchApiPerson(this.person).subscribe(() => {
          this.isSavingImage = false;
        });
      });
    }
  }

  removePerson() {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the person ' + this.person.firstName + ' ' + this.person.lastName,
        content: 'It will be deleted from all essays, timelines, and projects it may be associated with.'
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.personService.removeApiPerson(this.person).subscribe(() => {
          this.personService.removePerson(this.person);

          this.router.navigate(['/manager/persons']).then();
        });
      }
    });
  }

  deleteNote(note: PersonNote) {
    this.personService.removeApiNote(note).subscribe(() => {
      PersonService.removePersonNote(this.person, note);
    });
  }

  deleteTimeline(timeline: Timeline) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the timeline ' + timeline.label
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        let personTimelineToDelete: PersonTimeline = null;

        for (const personTimeline of this.person.personTimelines) {
          if (personTimeline.timeline.id.toString() === timeline.id.toString()) {
            personTimelineToDelete = personTimeline;
            break;
          }
        }

        if (personTimelineToDelete) {
          this.personService.removeApiPersonTimeline(personTimelineToDelete).subscribe(() => {
            for (let i = 0; i < this.person.personTimelines.length; i++) {
              if (this.person.personTimelines[i].id === personTimelineToDelete.id) {
                this.person.personTimelines.splice(i, 1);
              }
            }
          });
        }
      }
    });
  }

  deleteBiography(biography: Essay) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the biography ' + biography.title
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        let personBiographyToDelete: PersonBiography = null;

        for (const personBiography of this.person.personBiographies) {
          if (personBiography.biography.id === biography.id) {
            personBiographyToDelete = personBiography;
            break;
          }
        }

        if (personBiographyToDelete) {
          this.personService.removeApiPersonBiography(personBiographyToDelete).subscribe(() => {
            for (let i = 0; i < this.person.personBiographies.length; i++) {
              if (this.person.personBiographies[i].id === personBiographyToDelete.id) {
                this.person.personBiographies.splice(i, 1);
              }
            }
          });
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

  private _setReturnHeader() {
    const previousPage = this.userService.getPreviousPage();

    if (previousPage.length && previousPage.includes('/projects/')) {
      this.returnPath = previousPage;
      this.showReturnHeader = true;
    }
  }
}
