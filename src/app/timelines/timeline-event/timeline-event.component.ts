import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';

import { Event } from '../../models/event';

import { TimelineEventDetailsComponent } from '../timeline-event-details/timeline-event-details.component';

@Component({
  selector: 'app-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss']
})
export class TimelineEventComponent implements OnInit {
  @Input() public event: Event;

  public positionStyle;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.makePositionStyle();
  }

  makePositionStyle() {
    this.positionStyle = {
      left: this.event.timelineLocation + '%'
    };
  }

  showDetails() {
    this.dialog.open(TimelineEventDetailsComponent, {
      width: '500px',
      data: {
        event: this.event
      }
    });
  }
}
