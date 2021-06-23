import {Component, OnInit} from '@angular/core';

import {Timeline} from '../../models/timelines/timeline';
import {Sleep} from '../sleep';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-timeline-dialog',
  templateUrl: './add-timeline-dialog.component.html',
  styleUrls: ['./add-timeline-dialog.component.scss']
})
export class AddTimelineDialogComponent implements OnInit {
  public timelines: Timeline[];
  public timeline: Timeline;

  constructor(public dialogRef: MatDialogRef<AddTimelineDialogComponent>) {
    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  saveNewTimeline() {
    this.dialogRef.close(this.timeline);
  }

  saveTimelineTitle(value) {
    if (value) {
      this.timeline.label = value;
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('new_timeline_title').focus();
  }
}
