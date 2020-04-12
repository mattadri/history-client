import {Component, Inject, OnInit} from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import {Person} from '../../models/person';
import {Timeline} from '../../models/timeline';

import {TimelineEventDetailsComponent} from '../timeline-event-details/timeline-event-details.component';

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

  constructor(public dialogRef: MatDialogRef<TimelineEventDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    console.log(this.data.person);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
