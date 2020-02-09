import { Component, OnInit } from '@angular/core';

import { Person } from '../../models/person';

import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})

export class PersonsComponent implements OnInit {
  private createPersonMode;
  public persons: Person[];

  constructor(private personService: PersonService) {
    this.createPersonMode = false;
  }

  ngOnInit() {
    this.persons = [];

    this.getPersons();
  }

  showCreatePerson() {
    this.createPersonMode = true;
  }

  getPersons() {
    this.personService.getApiPersons().subscribe(persons => {
      for (const person of persons) {
        this.personService.setPerson(person);
      }

      this.persons = this.personService.getPersons();
    });
  }

}
