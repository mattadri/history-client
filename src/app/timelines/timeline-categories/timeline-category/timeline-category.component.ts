import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {TimelineCategory} from '../../../models/timeline-category';

@Component({
  selector: 'app-timeline-category',
  templateUrl: './timeline-category.component.html',
  styleUrls: ['./timeline-category.component.scss']
})

export class TimelineCategoryComponent implements OnInit {
  @Input() public category: TimelineCategory;

  @Output() private removeCategory: EventEmitter<TimelineCategory>;

  constructor() {
    this.removeCategory = new EventEmitter<TimelineCategory>();
  }

  ngOnInit() {}

  doDeleteCategory() {
    this.removeCategory.emit(this.category);
  }
}
