import { Component, OnInit } from '@angular/core';

import { Timeline } from '../models/timeline';

import { TimelineService } from '../services/timeline.service';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.scss']
})
export class TimelinesComponent implements OnInit {
  public timelines: Timeline[];
  public timeline: Timeline;

  constructor(private timelineService: TimelineService) {
    this.initializeNewTimeline();

    this.getTimelines();
  }

  ngOnInit() {
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
    this.timeline.label = '';
    this.timeline.events = [];
    this.timeline.persons = [];
  }

  getTimelines() {
    this.timelineService.getApiTimelines().subscribe(timelines => {
      for (const timeline of timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();
    });
  }

  createTimeline(timelineForm) {
    console.log('');
  }
}
