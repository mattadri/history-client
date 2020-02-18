import { Component, OnInit } from '@angular/core';

import { Options } from 'ng5-slider';

import { TimelineService } from '../../services/timeline.service';

import { Timeline } from '../../models/timeline';
import { Event } from '../../models/event';
import {ActivatedRoute} from '@angular/router';
import {Era} from '../../models/era';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  public timeline: Timeline;

  // make a record of the first and last event on the timeline
  private oldestEvent: Event;
  private newestEvent: Event;

  public timelineStart: number;
  public timelineEnd: number;
  public pointerStart: number;
  public pointerEnd: number;
  public options: Options;

  private timelineLengthInYears: number;
  private staticLengthInYears: number;

  private timelineEvents: Event[] = [];

  constructor(private route: ActivatedRoute, private timelineService: TimelineService) {
    const timelineId = this.route.snapshot.paramMap.get('id');

    this.timelineService.getApiTimeline(timelineId).subscribe(response => {
      this.timeline = response;

      this.oldestEvent = this.timeline.events[0];
      this.newestEvent = this.timeline.events[this.timeline.events.length - 1];

      this.timelineStart = this.convertNumber(this.oldestEvent.startYear, this.oldestEvent);
      this.timelineEnd = this.convertNumber(this.newestEvent.startYear, this.newestEvent);

      // make a copy of the full list for reference
      for (const event of this.timeline.events) {
        this.timelineEvents.push(event);
      }

      this.pointerStart = this.timelineStart;
      this.pointerEnd = this.timelineEnd;

      this.calculateTimeline();
    });
  }

  ngOnInit() { }

  calculateTimeline() {
    // reset the timeline to the original full list
    this.timeline.events = [];

    for (const event of this.timelineEvents) {
      this.timeline.events.push(event);
    }

    this.timeline.events = this.timeline.events.filter(event => {
      if (this.convertNumber(event.startYear, event) < this.pointerStart) {
        return false;
      } else if (this.convertNumber(event.startYear, event) > this.pointerEnd) {
        return false;
      }

      return true;
    });

    this.oldestEvent = this.timeline.events[0];
    this.newestEvent = this.timeline.events[this.timeline.events.length - 1];

    this.timelineLengthInYears = this.pointerStart - this.pointerEnd;
    this.staticLengthInYears = this.timelineStart - this.timelineEnd;

    // length in years should always be a positive number
    if (this.timelineLengthInYears < 0) {
      this.timelineLengthInYears = this.timelineLengthInYears * -1;
      this.staticLengthInYears = this.staticLengthInYears * -1;
    }

    for (const event of this.timeline.events) {
      // set the percentage location from oldest event.
      const percentage = 100 - ((event.startYear / this.timelineLengthInYears) * 100).toPrecision(2);
      event.timelineLocation = percentage.toLocaleString();
    }

    this.options = {
      floor: this.padTimelineDate(this.timelineStart, this.timelineLengthInYears, false),
      ceil: this.padTimelineDate(this.timelineEnd, this.timelineLengthInYears, true),
      tickStep: this.staticLengthInYears / 10,
      showTicks: true,
      showTicksValues: true,
      translate: (value: number): string => {
        const event = new Event();
        const era = new Era();

        era.initializeNewEra();
        event.initializeNewEvent();

        era.label = 'AD';

        if (value < 0) {
          value = value * -1;
          era.label = 'BC';
        }

        event.formatYears(true, null, value, era);

        let newValue = event.formattedStartYear;

        newValue = newValue.toLocaleString('en').toString();

        return newValue;
      }
    };
  }

  // If the era is BC then make the number a negative
  private convertNumber(value: number, comparator: Event): number {
    if (comparator.startEra.label === 'BC') {
      value = value * -1;
    }

    return value;
  }

  private padTimelineDate(yearToPad: number, timelineLength: number, increase: boolean) {
    const minPadding = 5;
    const maxPadding = 100;

    // get 10 percent of the total length and see if it falls within the min/max range.
    let padding = timelineLength * .1;

    if (padding < minPadding) {
      padding = minPadding;
    }

    if (padding > maxPadding) {
      padding = maxPadding;
    }

    if (increase) {
      yearToPad = yearToPad + padding;
    } else {
      yearToPad = yearToPad - padding;
    }

    return yearToPad;
  }
}
