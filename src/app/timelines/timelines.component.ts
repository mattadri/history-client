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

  public isCreateTimelineMode: boolean;
  public isEditTimelineMode: boolean;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private timelineService: TimelineService) {
    this.timelines = [];

    this.initializeNewTimeline();

    this.isCreateTimelineMode = false;
    this.isEditTimelineMode = false;

    this.getTimelines('/timelines?order_by=ascending&page%5Bnumber%5D=1&fields[timeline]=label');
  }

  static closeTimelineDetails(sideNav) {
    sideNav.close();
  }

  ngOnInit() {
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
    this.timeline.label = '';
    this.timeline.events = [];
    this.timeline.persons = [];
  }

  getTimelines(path) {
    this.timelineService.getApiTimelines(path).subscribe(response => {
      for (const timeline of response.timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  openCreateDialog(timeline, sideNav, isCreateMode, isEditMode) {
    this.timeline = timeline;

    if (!isCreateMode) {
      isCreateMode = false;
    }

    if (!isEditMode) {
      isEditMode = false;
    }

    this.isCreateTimelineMode = isCreateMode;
    this.isEditTimelineMode = isEditMode;

    if (sideNav.opened) {
      sideNav.close().then(() => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

   cancelEditCreateModes(sideNav) {
    if (this.isCreateTimelineMode) {
      TimelinesComponent.closeTimelineDetails(sideNav);
    }

    this.isCreateTimelineMode = false;
    this.isEditTimelineMode = false;
  }

  activateCreateMode(sideNav) {
    this.isCreateTimelineMode = true;

    this.initializeNewTimeline();

    this.openCreateDialog(this.timeline, sideNav, true, false);
  }

  createTimeline(sideNav) {
    return this.timelineService.createApiTimeline(this.timeline).subscribe(response => {
      this.timeline.id = response.data.id;

      this.timelineService.setTimeline(this.timeline);

      this.isCreateTimelineMode = false;

      TimelinesComponent.closeTimelineDetails(sideNav);

      this.initializeNewTimeline();
    });
  }

  turnPage(timeline) {
    if (timeline.pageIndex < timeline.previousPageIndex) {
      this.getTimelines(this.previousPage);
    } else if (timeline.pageIndex > timeline.previousPageIndex) {
      this.getTimelines(this.nextPage);
    }
  }
}
