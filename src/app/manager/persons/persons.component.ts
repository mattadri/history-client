import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import {Observable} from 'rxjs';

import {QuickPersonComponent} from './quick-person/quick-person.component';

import { Person } from '../../models/person';
import { Source } from '../../models/source';
import { Timeline } from '../../models/timeline';
import { TimelinePerson } from '../../models/timeline-person';

import { PersonService } from '../../services/person.service';
import {ConfirmRemovalComponent} from '../../utilities/confirm-removal/confirm-removal.component';

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

  public personLink: string;

  constructor(private personService: PersonService,
              public dialog: MatDialog) {

    this.persons = [];

    this.initializeNewPerson();

    this.getPersons(
      '/persons?sort=-created&page%5Bnumber%5D=1' +
      '&fields[person]=first_name,middle_name,last_name,description,birth_day,birth_month,birth_year,' +
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

  removePerson(contentPanel) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the person ',
        content: '' +
        '<li>' + this.person.notes.length.toString() + ' notes will be removed.</li>' +
        '<li>Will impact ' + this.person.timelines.length + ' timelines.</li>'
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.personService.removeApiPerson(this.person).subscribe(() => {
          this.personService.removePerson(this.person);

          this.closePersonDetails(contentPanel);
        });
      }
    });
  }

  openPersonDetails(person, sideNav) {
    this.initializeNewPerson();

    this.person = person;

    this.personLink = this.person.id.toString();

    if (sideNav.opened) {
      sideNav.close().then(() => {
        sideNav.open();
      });
    } else {
      sideNav.open();
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

  closePersonDetails(sideNav) {
    sideNav.close();
  }

  turnPage(person) {
    if (person.pageIndex < person.previousPageIndex) {
      this.getPersons(this.previousPage, null, null);
    } else if (person.pageIndex > person.previousPageIndex) {
      this.getPersons(this.nextPage, null, null);
    }
  }
}
