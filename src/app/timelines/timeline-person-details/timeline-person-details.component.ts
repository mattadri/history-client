import {Component, Inject, OnInit} from '@angular/core';

import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import {Person} from '../../models/persons/person';
import {Timeline} from '../../models/timelines/timeline';

export interface DialogData {
  person: Person;
  timeline: Timeline;
}

@Component({
  selector: 'app-timeline-person-details',
  templateUrl: './timeline-person-details.component.html',
  styleUrls: ['./timeline-person-details.component.scss']
})

export class TimelinePersonDetailsComponent implements OnInit {

  constructor(public dialogRef: MatBottomSheetRef<TimelinePersonDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: DialogData) { }

  ngOnInit() { }

  onNoClick(): void {
    this.dialogRef.dismiss();
  }
}
