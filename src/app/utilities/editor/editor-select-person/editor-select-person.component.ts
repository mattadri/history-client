import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {PersonService} from '../../../services/person.service';

import {Person} from '../../../models/person';

@Component({
  selector: 'app-editor-select-person',
  templateUrl: './editor-select-person.component.html',
  styleUrls: ['./editor-select-person.component.scss']
})
export class EditorSelectPersonComponent implements OnInit {
  public persons: Person[];

  public responseObject: any;

  public loadAutoComplete: boolean;

  public personsAutocompleteControl = new FormControl();
  public personsFilteredOptions: Observable<Person[]>;
  public personFieldDisplayValue: string;

  constructor(public dialogRef: MatDialogRef<EditorSelectPersonComponent>, private personService: PersonService) {
    this.responseObject = {
      person: null
    };

    this.loadAutoComplete = false;

    this.personService.getApiPersons('/persons?page[size]=0&fields[person]=first_name,middle_name,last_name', null, null, false)
      .subscribe(persons => {

      for (const person of persons.persons) {
        this.personService.setPerson(person);
      }

      this.persons = this.personService.getPersons();

      this.personsFilteredOptions = this.personsAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(event => this._filterPersons(event))
      );

      this.loadAutoComplete = true;
    });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  savePerson() {
    this.responseObject.person = this.personsAutocompleteControl.value;
  }

  displayPerson(person: Person) {
    if (person) {
      this.personFieldDisplayValue = person.firstName;

      if (person.middleName) {
        this.personFieldDisplayValue += ' ' + person.middleName;
      }

      if (person.lastName) {
        this.personFieldDisplayValue += ' ' + person.lastName;
      }
    }

    return this.personFieldDisplayValue;
  }

  private _filterPersons(filterValue: any): Person[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.persons.filter(person => {
        return person.firstName.toLowerCase().includes(filterValue) || person.lastName.toLowerCase().includes(filterValue);
      });
    }
  }
}
