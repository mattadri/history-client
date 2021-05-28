import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';

import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Sleep} from '../../../utilities/sleep';

import {Source} from '../../../models/source';
import {Era} from '../../../models/era';
import {Month} from '../../../models/month';
import {Person} from '../../../models/persons/person';

import {PersonService} from '../../../services/person.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';

export interface DialogData {
  showExisting: boolean;
  showNew: boolean;
}

class QuickPersonReturnData {
  person: Person;
  isExisting: boolean;
}

@Component({
  selector: 'app-quick-person',
  templateUrl: './quick-person.component.html',
  styleUrls: ['./quick-person.component.scss']
})
export class QuickPersonComponent implements OnInit, AfterViewInit {
  public searchPersons: Person[] = [];

  public personNameAutocompleteControl = new FormControl();
  public personNameFilteredOptions: Observable<Person[]>;
  public personNameFieldDisplayValue: string;

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

  private returnData: QuickPersonReturnData;

  constructor(private personService: PersonService,
              private eraService: EraService,
              private monthService: MonthService,
              public dialogRef: MatDialogRef<QuickPersonComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.returnData = new QuickPersonReturnData();

    this.person = new Person();
    this.person.initializeNewPerson();

    this.eraService.getEras().subscribe(eras => {
      for (const era of eras.data) {
        const newEra = new Era().mapEra(era);

        // set to AD so that drop-downs auto populate with the value.
        if (newEra.label === 'AD') {
          this.person.birthEra = newEra;
          this.person.deathEra = newEra;
        }

        this.eras.push(newEra);
      }
    });

    this.monthService.getMonths().subscribe(months => {
      for (const month of months.data) {
        this.months.push(new Month().mapMonth(month));
      }
    });

    this.personService.getApiPersons(
      '/persons?page[size]=0&fields[person]=first_name,last_name,birth_year,birth_era,death_year,death_era&sort=last_name',
      null, null, false)
      .subscribe(response => {

      this.searchPersons = response.persons;

      this.personNameFilteredOptions = this.personNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(person => this._filterPersonsName(person))
      );

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

  ngOnInit() { }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveExistingPerson(person) {
    this.returnData.person = person;
    this.returnData.isExisting = true;

    this.dialogRef.close(this.returnData);
  }

  saveNewPerson() {
    this.returnData.person = this.person;
    this.returnData.isExisting = false;

    this.dialogRef.close(this.returnData);
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

  displayPersonName(person: Person) {
    if (person) {
      this.personNameFieldDisplayValue = '';

      if (person.firstName) {
        this.personNameFieldDisplayValue = person.firstName;
      }

      if (person.lastName) {
        this.personNameFieldDisplayValue = this.personNameFieldDisplayValue + ' ' + person.lastName;
      }
    }

    return this.personFirstNameFieldDisplayValue;
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

  private _filterPersonsName(filterValue: any): Person[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchPersons.filter(person => {
        if (person.firstName || person.lastName) {
          return person.firstName.toLowerCase().includes(filterValue) || person.lastName.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
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

    try {
      document.getElementById('person_name').focus();
    } catch(e) {
      document.getElementById('person_first_name').focus();
    }
  }
}
