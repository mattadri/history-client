import {Component, Inject, OnInit} from '@angular/core';
import {Timeline} from '../../models/timeline';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';

export interface DialogData {
  timeline: Timeline;
}

@Component({
  selector: 'app-essay-timeline-details',
  templateUrl: './essay-timeline-details.component.html',
  styleUrls: ['./essay-timeline-details.component.scss']
})
export class EssayTimelineDetailsComponent implements OnInit {
  public timelineLink: string;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: DialogData) { }

  ngOnInit() {
    this.timelineLink = '/timeline/' + this.data.timeline.id.toString();
  }

}
