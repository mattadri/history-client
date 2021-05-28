import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';

import { Event } from '../../models/events/event';
import {Timeline} from '../../models/timelines/timeline';

import { TimelineEventDetailsComponent } from '../timeline-event-details/timeline-event-details.component';
import {Category} from '../../models/category';
import {TimelineEvent} from '../../models/timelines/timeline-event';

@Component({
  selector: 'app-timeline-event-list',
  templateUrl: './timeline-event-list.component.html',
  styleUrls: ['./timeline-event-list.component.scss']
})

export class TimelineEventListComponent implements OnInit {
  @Input() public timelineEvent: TimelineEvent;
  @Input() public event: Event;
  @Input() public timeline: Timeline;
  @Input() public categoryEvents: Array<Category>;

  public isSelected: boolean;
  public styles: object;

  public showEditButton: boolean;

  public listOnly: boolean;

  constructor(public bottomSheet: MatBottomSheet) {

  }

  ngOnInit() {
    this.isSelected = false;

    this.listOnly = !this.timeline;

    this.applyStyles();
  }

  applyColorClass() {
    return 'grid-list-item-key';
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
    this.bottomSheet.open(TimelineEventDetailsComponent as any, {
      data: {
        timelineEvent: this.timelineEvent,
        timeline: this.timeline,
        categoryEvents: this.categoryEvents
      }
    });
  }
}
