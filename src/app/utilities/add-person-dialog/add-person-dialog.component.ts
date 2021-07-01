import { Component, OnInit } from '@angular/core';
import {Person} from '../../models/persons/person';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {Era} from '../../models/era';
import {Month} from '../../models/month';
import {Source} from '../../models/source';
import {MatDialogRef} from '@angular/material/dialog';
import {MonthService} from '../../services/month.service';
import {EraService} from '../../services/era.service';
import {PersonService} from '../../services/person.service';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-person-dialog',
  templateUrl: './add-person-dialog.component.html',
  styleUrls: ['./add-person-dialog.component.scss']
})
export class AddPersonDialogComponent implements OnInit {
  public searchPersons: Person[] = [];

  public personFirstNameAutocompleteControl = new FormControl();
  public personFirstNameFilteredOptions: Observable<Person[]>;
  public personFirstNameFieldDisplayValue: string;

  public personLastNameAutocompleteControl = new FormControl();
  public personLastNameFilteredOptions: Observable<Person[]>;
  public personLastNameFieldDisplayValue: string;

  public eras: Era[] = [];
  public months: Month[] = [];
  public sources: Source[] = [];

  public person: Person;

  constructor(private personService: PersonService,
              private eraService: EraService,
              private monthService: MonthService,
              public dialogRef: MatDialogRef<AddPersonDialogComponent>) {
    this.person = new Person();
    this.person.initializeNewPerson();

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

    this.personService.getApiPersons(
      null,
      '0',
      null,
      null,
      ['first_name', 'last_name', 'birth_year', 'birth_era', 'death_year', 'death_era'],
      null,
      false,
      null,
      false).subscribe(response => {

      this.searchPersons = response.persons;

      this.personFirstNameFilteredOptions = this.personFirstNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(person => this._filterPersonsFirstName(person))
      );

      this.personLastNameFilteredOptions = this.personLastNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(person => this._filterPersonsLastName(person))
      );
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNewPerson() {
    this.dialogRef.close(this.person);
  }

  savePersonFirstName(value) {
    if (value) {
      this.person.firstName = value;
    }
  }

  savePersonLastName(value) {
    if (value) {
      this.person.lastName = value;
    }
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

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('person_first_name').focus();
  }
}
