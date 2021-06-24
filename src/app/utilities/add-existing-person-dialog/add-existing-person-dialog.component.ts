import { Component, OnInit } from '@angular/core';
import {Person} from '../../models/persons/person';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {PersonService} from '../../services/person.service';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-existing-person-dialog',
  templateUrl: './add-existing-person-dialog.component.html',
  styleUrls: ['./add-existing-person-dialog.component.scss']
})
export class AddExistingPersonDialogComponent implements OnInit {
  public searchPersons: Person[] = [];

  public personNameAutocompleteControl = new FormControl();
  public personNameFilteredOptions: Observable<Person[]>;
  public personNameFieldDisplayValue: string;

  constructor(private personService: PersonService, public dialogRef: MatDialogRef<AddExistingPersonDialogComponent>,) {
    this.personService.getApiPersons(
      '/persons?page[size]=0&fields[person]=first_name,last_name,birth_year,birth_era,death_year,death_era&sort=last_name',
      null, null, false)
      .subscribe(response => {

      this.searchPersons = response.persons;

      this.personNameFilteredOptions = this.personNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(person => this._filterPersonsName(person))
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

  saveExistingPerson(person) {
    this.dialogRef.close(person);
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

    return this.personNameFieldDisplayValue;
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

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('person_name').focus();
  }
}
