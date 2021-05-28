import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Timeline } from '../../../models/timelines/timeline';

@Component({
  selector: 'app-event-timeline',
  templateUrl: './event-timeline.component.html',
  styleUrls: ['./event-timeline.component.scss']
})
export class EventTimelineComponent implements OnInit {
  @Input() public timeline: Timeline;

  @Output() private removeTimeline: EventEmitter<Timeline>;

  constructor() {
    this.removeTimeline = new EventEmitter<Timeline>();
  }

  ngOnInit() { }

  doRemoveTimeline() {
    this.removeTimeline.emit(this.timeline);
  }
}
