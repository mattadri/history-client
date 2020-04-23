import {Component, Inject, OnInit} from '@angular/core';

import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';
import {EssayReference} from '../../models/essay-reference';

export interface DialogData {
  ref: EssayReference;
}

@Component({
  selector: 'app-essay-reference-details',
  templateUrl: './essay-reference-details.component.html',
  styleUrls: ['./essay-reference-details.component.scss']
})

export class EssayReferenceDetailsComponent implements OnInit {

  constructor(public dialogRef: MatBottomSheetRef<EssayReferenceDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA)
              public data: DialogData) { }

  ngOnInit() {
  }

}
