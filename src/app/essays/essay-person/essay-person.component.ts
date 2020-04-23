import {Component, Input, OnInit} from '@angular/core';
import {Person} from '../../models/person';
import {EssayPerson} from '../../models/essay-person';

@Component({
  selector: 'app-essay-person',
  templateUrl: './essay-person.component.html',
  styleUrls: ['./essay-person.component.scss']
})
export class EssayPersonComponent implements OnInit {
  @Input() public essayPerson: EssayPerson;

  constructor() { }

  ngOnInit() {
  }

}
