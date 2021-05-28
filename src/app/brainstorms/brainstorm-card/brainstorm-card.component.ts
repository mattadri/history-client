import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Brainstorm} from '../../models/brainstorm';

@Component({
  selector: 'app-brainstorm-card',
  templateUrl: './brainstorm-card.component.html',
  styleUrls: ['./brainstorm-card.component.scss']
})
export class BrainstormCardComponent implements OnInit {
  @Input() public brainstorm: Brainstorm;
  @Input() public canDelete: boolean;

  @Output() private removeBrainstorm: EventEmitter<Brainstorm>;

  constructor() {
    this.removeBrainstorm = new EventEmitter<Brainstorm>();
  }

  ngOnInit() {
  }

  doRemoveBrainstorm() {
    this.removeBrainstorm.emit(this.brainstorm);
  }
}
