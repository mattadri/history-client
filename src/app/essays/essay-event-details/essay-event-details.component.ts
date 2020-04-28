import {Component, Inject, OnInit} from '@angular/core';
import {Event} from '../../models/event';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';

export interface DialogData {
  event: Event;
}

@Component({
  selector: 'app-essay-event-details',
  templateUrl: './essay-event-details.component.html',
  styleUrls: ['./essay-event-details.component.scss']
})
export class EssayEventDetailsComponent implements OnInit {

  constructor(public dialogRef: MatBottomSheetRef<EssayEventDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: DialogData) { }

  ngOnInit() {
    this.data.event.formatYears();
    this.data.event.formatDates();
  }

}
