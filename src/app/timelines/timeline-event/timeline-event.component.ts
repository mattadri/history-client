import { Component, OnInit, Input } from '@angular/core';

import { Event } from '../../models/event';

@Component({
  selector: 'app-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss']
})
export class TimelineEventComponent implements OnInit {
  @Input() public event: Event;

  public positionStyle;

  constructor() { }

  ngOnInit() {
    this.makePositionStyle();
  }

  makePositionStyle() {
    this.positionStyle = {
      left: this.event.timelineLocation + '%'
    };
  }
}
