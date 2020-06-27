import {Component, Input, OnInit} from '@angular/core';

import {Brainstorm} from '../../models/brainstorm';

@Component({
  selector: 'app-brainstorm-card',
  templateUrl: './brainstorm-card.component.html',
  styleUrls: ['./brainstorm-card.component.scss']
})
export class BrainstormCardComponent implements OnInit {
  @Input() public brainstorm: Brainstorm;

  constructor() { }

  ngOnInit() {
  }

}
