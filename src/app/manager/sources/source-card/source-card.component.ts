import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { Source } from '../../../models/source';

@Component({
  selector: 'app-source-card',
  templateUrl: './source-card.component.html',
  styleUrls: ['./source-card.component.scss']
})
export class SourceCardComponent implements OnInit {
  @Input() public source: Source;
  @Input() public canDelete: boolean;

  @Output() private removeSource: EventEmitter<Source>;

  constructor() {
    this.removeSource = new EventEmitter<Source>();
  }

  ngOnInit() {
  }

  doRemoveSource() {
    this.removeSource.emit(this.source);
  }
}
