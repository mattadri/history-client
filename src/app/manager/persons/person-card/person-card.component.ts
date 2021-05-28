import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Person } from '../../../models/persons/person';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input() public person: Person;
  @Input() public canDelete: boolean;

  @Output() private removePerson: EventEmitter<Person>;

  constructor() {
    this.removePerson = new EventEmitter<Person>();
  }

  ngOnInit() {
  }

  doRemovePerson() {
    this.removePerson.emit(this.person);
  }
}
