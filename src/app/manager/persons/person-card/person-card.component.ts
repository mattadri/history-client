import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Person } from '../../../models/person';

@Component({
  selector: 'app-person-card',
  templateUrl: './person-card.component.html',
  styleUrls: ['./person-card.component.scss']
})
export class PersonCardComponent implements OnInit {
  @Input() public person: Person;

  @Output() private loadPerson: EventEmitter<Person>;

  constructor() {
    this.loadPerson = new EventEmitter<Person>();
  }

  ngOnInit() {
  }

  onLoadDetails() {
    this.loadPerson.emit(this.person);
  }
}
