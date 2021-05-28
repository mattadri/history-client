import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { Timeline } from '../../models/timelines/timeline';

@Component({
  selector: 'app-timeline-card',
  templateUrl: './timeline-card.component.html',
  styleUrls: ['./timeline-card.component.scss']
})
export class TimelineCardComponent implements OnInit {
  @Input() public timeline: Timeline;
  @Input() public canDelete: boolean;

  @Output() private removeTimeline: EventEmitter<Timeline>;

  constructor() {
    this.removeTimeline = new EventEmitter<Timeline>();
  }

  ngOnInit() { }

  doRemoveTimeline() {
    this.removeTimeline.emit(this.timeline);
  }
}
