import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Timeline } from '../models/timelines/timeline';

import { TimelineService } from '../services/timeline.service';

import { AddTimelineDialogComponent } from '../utilities/add-timeline-dialog/add-timeline-dialog.component';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-timelines',
  templateUrl: './timelines.component.html',
  styleUrls: ['./timelines.component.scss']
})

export class TimelinesComponent implements OnInit {
  public timelines: Timeline[];
  public timeline: Timeline;

  public userTimelines: Timeline[];
  public allTimelines: Timeline[];

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  public showAllToggleColor: ThemePalette;
  public showAllToggleChecked: boolean;

  private userId;

  constructor(public dialog: MatDialog, private timelineService: TimelineService) {
    this.showAllToggleChecked = false;
    this.showAllToggleColor = 'primary';

    this.userId = localStorage.getItem('user.id');

    this.timelines = [];
    this.userTimelines = [];
    this.allTimelines = [];

    this.initializeNewTimeline();

    this.getUserTimelines(null, false);
  }

  ngOnInit() {
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();
  }

  getUserTimelines(path: string, isAnotherPage: boolean) {
    if (!this.userTimelines.length || isAnotherPage) {
      this.timelineService.getApiTimelines(path, this.userId, '5', '1', null, null, null, null, isAnotherPage).subscribe(response => {
        for (const timeline of response.timelines) {
          this.timelineService.setTimeline(timeline);
        }

        this.timelines = this.timelineService.getTimelines();
        this.userTimelines = this.timelineService.getTimelines();

        this.totalResults = response.total;
        this.nextPage = response.links.next;
        this.previousPage = response.links.prev;
      });
    } else {
      this.timelines = this.userTimelines;
    }
  }

  getAllTimelines(path: string, isAnotherPage: boolean) {
    if (!this.allTimelines.length || isAnotherPage) {
      this.timelineService.getApiTimelines(path, null, '5', '1', null, null, null, null, isAnotherPage).subscribe(response => {
        for (const timeline of response.timelines) {
          this.timelineService.setTimeline(timeline);
        }

        this.timelines = this.timelineService.getTimelines();
        this.allTimelines = this.timelineService.getTimelines();

        this.totalResults = response.total;
        this.nextPage = response.links.next;
        this.previousPage = response.links.prev;
      });
    } else {
      this.timelines = this.allTimelines;
    }
  }

  toggleTimelines() {
    if (this.showAllToggleChecked) {
      this.getAllTimelines(null, false);
    } else {
      this.getUserTimelines(null, false);
    }
  }

  createTimeline() {
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '750px',
      data: {
        showExisting: false,
        showNew: true
      }
    });

    dialogRef.afterClosed().subscribe(responseData => {
      let timeline = responseData.timeline;

      if (timeline) {
        this.timelineService.createApiTimeline(timeline).subscribe(response => {
          timeline.id = response.data.id;

          this.timelineService.setTimeline(timeline);

          this.timelines.unshift(timeline);
          this.allTimelines.unshift(timeline);
          this.userTimelines.unshift(timeline);

          this.timelineService.addUserToTimeline(timeline, this.userId).subscribe(() => {});
        });
      }
    });
  }

  turnPage(timeline) {
    if (timeline.pageIndex < timeline.previousPageIndex) {
      if (this.showAllToggleChecked) {
        this.getAllTimelines(this.previousPage, true);
      } else {
        this.getUserTimelines(this.previousPage, true);
      }
    } else if (timeline.pageIndex > timeline.previousPageIndex) {
      if (this.showAllToggleChecked) {
        this.getAllTimelines(this.nextPage, true);
      } else {
        this.getUserTimelines(this.nextPage, true);
      }
    }
  }
}
