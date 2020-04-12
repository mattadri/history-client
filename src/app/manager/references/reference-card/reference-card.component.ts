import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Reference } from '../../../models/reference';

@Component({
  selector: 'app-reference-card',
  templateUrl: './reference-card.component.html',
  styleUrls: ['./reference-card.component.scss']
})
export class ReferenceCardComponent implements OnInit {
  @Input() public reference: Reference;

  @Output() private loadReference: EventEmitter<Reference>;

  constructor() {
    this.loadReference = new EventEmitter<Reference>();
  }

  ngOnInit() {
  }

  onLoadDetails() {
    this.loadReference.emit(this.reference);
  }
}
