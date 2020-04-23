import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material';

import { Event } from '../../models/event';
import {Timeline} from '../../models/timeline';

import { TimelineEventDetailsComponent } from '../timeline-event-details/timeline-event-details.component';

@Component({
  selector: 'app-timeline-event-list',
  templateUrl: './timeline-event-list.component.html',
  styleUrls: ['./timeline-event-list.component.scss']
})

export class TimelineEventListComponent implements OnInit {
  @Input() public event: Event;
  @Input() public timeline: Timeline;
  @Input() public categoryEvents: Array;

  public isSelected: boolean;
  public styles: object;

  public listOnly: boolean;

  constructor(public bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.isSelected = false;

    this.event.formatYears();

    this.applyStyles();

    this.listOnly = !this.timeline;

    this.event.formatDates();
  }

  pinHighlight() {
    let classes = '';

    if (!this.event.colorClass && this.event.listEventIsHighlighted) {
      classes = 'highlight-item';
    }

    if (this.event.colorClass && this.event.listEventIsHighlighted) {
      classes = 'highlight-range';
    }

    return classes;
  }

  applyColorClass() {
    return 'grid-list-item-key';
  }

  applyStyles() {
    this.styles = {
      'background-color': this.event.colorClass
    };
  }

  highlightEvent() {
    this.showEditButton = true;

    if (!this.isSelected) {
      this.event.timelineEventIsHighlighted = true;
    }
  }

  deHighlightEvent() {
    this.showEditButton = false;

    if (!this.isSelected) {
      this.event.timelineEventIsHighlighted = false;
    }
  }

  toggleSelectEvent() {
    this.isSelected = !this.isSelected;
    this.event.timelineEventIsHighlighted = this.isSelected;
    this.event.listEventIsHighlighted = this.isSelected;
  }

  showDetails() {
    this.bottomSheet.open(TimelineEventDetailsComponent, {
      width: '500px',
      data: {
        event: this.event,
        timeline: this.timeline,
        categoryEvents: this.categoryEvents
      }
    });
  }
}
