import {Component, Inject, OnInit} from '@angular/core';

import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {EssayReference} from '../../models/essays/essay-reference';
import {Source} from '../../models/source';

export interface DialogData {
  ref: EssayReference;
  source: Source;
  chapter: string;
  page: string;
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
