import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material';

import { Event } from '../../models/event';

import { TimelineEventDetailsComponent } from '../timeline-event-details/timeline-event-details.component';
import {Timeline} from '../../models/timeline';
import {Category} from '../../models/category';

@Component({
  selector: 'app-timeline-event',
  templateUrl: './timeline-event.component.html',
  styleUrls: ['./timeline-event.component.scss', '../timeline/timeline.component.scss']
})
export class TimelineEventComponent implements OnInit {
  @Input() public event: Event;
  @Input() public timeline: Timeline;
  @Input() public categoryEvents: Array<Category>;

  public positionStyle: object;
  public isSinglePointEvent: boolean;

  public isSelected: boolean;

  public eventIconTooltipPosition: string;

  constructor(public bottomSheet: MatBottomSheet) {
    this.eventIconTooltipPosition = 'above';
  }

  ngOnInit() {
    this.makePositionStyle();

    this.isSinglePointEvent = this.event.formattedStartDate === this.event.formattedEndDate;

    this.isSelected = false;
  }

  makePositionStyle() {
    this.positionStyle = {
      left: this.event.timelineStartLocation + '%',
      width: this.event.timelineEndLocation + '%',
      'background-color': this.event.colorClass
    };
  }

  applyEventClasses() {
    let classes = '';

    if (this.event.timelineEventIsHighlighted) {
      classes = classes + 'highlight-event-marker ';
    }

    if (this.isSinglePointEvent) {
      classes = classes + 'single-point ';
    }

    if (this.event.colorClass) {
      classes = classes + ' color-' + this.event.colorClass;
    }

    return classes;
  }

  highlightEvent() {
    this.event.listEventIsHighlighted = true;
  }

  deHighlightEvent() {
    if (!this.isSelected) {
      this.event.listEventIsHighlighted = false;
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
        event: this.event,
        timeline: this.timeline,
        categoryEvents: this.categoryEvents
      }
    });
  }
}
