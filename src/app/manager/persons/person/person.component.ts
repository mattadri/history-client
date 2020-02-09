import { Component, OnInit, Input } from '@angular/core';

import { Person } from '../../../models/person';

import { PersonService } from '../../../services/person.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})

export class PersonComponent implements OnInit {
  @Input() public person: Person;

  public personAge: number;

  constructor(private personService: PersonService) { }

  ngOnInit() {
    this.calculatePersonAge();
  }

  removePerson() {
    this.personService.removeApiPerson(this.person).subscribe(result => {
      this.personService.removePerson(this.person);
    });
  }

  calculatePersonAge() {
    if (this.person.birthYear && this.person.deathYear) {
      console.log('years match.');
      if (this.person.birthEra.label === 'BC' && this.person.deathEra.label === 'BC') {
        console.log('eras match');
        this.personAge = this.person.birthYear - this.person.deathYear;
      }
    }
  }
}
