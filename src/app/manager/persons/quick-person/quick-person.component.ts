import { Component, OnInit, AfterViewInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {MatDialogRef} from '@angular/material';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Sleep} from '../../../utilities/sleep';

import {Source} from '../../../models/source';
import {Era} from '../../../models/era';
import {Month} from '../../../models/month';
import {Person} from '../../../models/person';

import {PersonService} from '../../../services/person.service';
import {SourceService} from '../../../services/source.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';

@Component({
  selector: 'app-quick-person',
  templateUrl: './quick-person.component.html',
  styleUrls: ['./quick-person.component.scss']
})
export class QuickPersonComponent implements OnInit, AfterViewInit {
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

  public eras: Era[] = [];
  public months: Month[] = [];
  public sources: Source[] = [];

  public person: Person;

  constructor(private personService: PersonService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              public dialogRef: MatDialogRef<QuickPersonComponent>) {

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

  ngOnInit() { }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSource() {
    this.person.source = this.sourcesAutocompleteControl.value;
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

  displaySource(source: Source) {
    if (source) {
      this.sourceFieldDisplayValue = source.title;

      if (source.subTitle) {
        this.sourceFieldDisplayValue = this.sourceFieldDisplayValue + ': ' + source.subTitle;
      }
    }

    return this.sourceFieldDisplayValue;
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

  private _filterSources(filterValue: any): Source[] {
    // when a source is actually selected the value is changed to the source itself. Do not filter if that is the case.
    if (!filterValue.id) {
      filterValue = filterValue.toLowerCase();

      return this.sources.filter(source => {
        return source.title.toLowerCase().includes(filterValue);
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

    document.getElementById('person_first_name').focus();
  }
}
