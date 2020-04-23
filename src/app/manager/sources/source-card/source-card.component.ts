import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Source } from '../../../models/source';

@Component({
  selector: 'app-source-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.scss']
})
export class SourceCardComponent implements OnInit {
  @Input() public source: Source;

  @Output() private loadSource: EventEmitter<Source>;

  constructor() {
    this.loadSource = new EventEmitter<Source>();
  }

  ngOnInit() {
  }

  onLoadDetails() {
    this.loadSource.emit(this.source);
  }
}
