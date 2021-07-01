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

    this.getPersons(null, null, null, null, false, false);
  }

  ngOnInit() { }

  initializeNewPerson() {
    this.person = new Person();

    this.person.initializeNewPerson();
  }

  getPersons(path, filterTerm: string, dateFilter: Array<string>, sort: Array<string>, sortDescending: boolean, isAnotherPage: boolean) {
    let additionalFilters = [];

    if (filterTerm) {
      const searchFilter = {
        or: [
          {
            name: 'description',
            op: 'ilike',
            val: '%' + filterTerm + '%'
          },
          {
            name: 'first_name',
            op: 'ilike',
            val: '%' + filterTerm + '%'
          },
          {
            name: 'last_name',
            op: 'ilike',
            val: '%' + filterTerm + '%'
          }
        ]
      };

      additionalFilters.push(searchFilter);
    }

    if (dateFilter) {
      if (dateFilter.length === 2) {
        const startDateFilter = {
          name: 'birth_year',
          op: 'gt',
          val: dateFilter[0]
        };

        const endDateFilter = {
          name: 'birth_year',
          op: 'lt',
          val: dateFilter[1]
        };

        additionalFilters.push(startDateFilter);
        additionalFilters.push(endDateFilter);
      }
    }

    this.personService.getApiPersons(
      path,
      null,
      null,
      null,
      ['first_name', 'middle_name', 'last_name', 'image', 'birth_year', 'birth_era', 'death_year', 'death_era'],
      sort,
      sortDescending,
      additionalFilters,
      isAnotherPage).subscribe(response => {

      this.persons = response.persons;

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

    this.getPersons('/persons', stringFilter, dateFilter, ['created'], true, false);
  }

  turnPage(person) {
    if (person.pageIndex < person.previousPageIndex) {
      this.getPersons(this.previousPage, null, null, null, false, true);
    } else if (person.pageIndex > person.previousPageIndex) {
      this.getPersons(this.nextPage, null, null, null, false, true);
    }
  }
}
