import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import {Observable} from 'rxjs';

import { Person } from '../../models/persons/person';
import { Source } from '../../models/source';

import { PersonService } from '../../services/person.service';
import {AddPersonDialogComponent} from '../../utilities/add-person-dialog/add-person-dialog.component';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})

export class PersonsComponent implements OnInit {
  public persons: Person[];
  public person: Person;

  public filterQuery: string;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;

  constructor(private personService: PersonService,
              public dialog: MatDialog) {

    this.persons = [];

    this.initializeNewPerson();

    this.getPersons(
      '/persons?sort=-created&page%5Bnumber%5D=1' +
      '&fields[person]=first_name,middle_name,last_name,image,description,birth_day,birth_month,birth_year,' +
      'birth_era,death_day,death_month,death_year,death_era,reference',
      null, null);
  }

  ngOnInit() { }

  initializeNewPerson() {
    this.person = new Person();

    this.person.initializeNewPerson();
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

  createPerson() {
    const dialogRef = this.dialog.open(AddPersonDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(person => {
      if (person.firstName && person.birthYear) {
        this.personService.createApiPerson(person).subscribe(response => {
          person.id = response.data.id;

          person.formatYears();

          this.personService.setPerson(person);

          this.persons.unshift(person);
        });
      }
    });
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

  turnPage(person) {
    if (person.pageIndex < person.previousPageIndex) {
      this.getPersons(this.previousPage, null, null);
    } else if (person.pageIndex > person.previousPageIndex) {
      this.getPersons(this.nextPage, null, null);
    }
  }
}
