import {Component, Inject, OnInit} from '@angular/core';
import {Person} from '../../models/person';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material';

export interface DialogData {
  person: Person;
}


@Component({
  selector: 'app-essay-person-details',
  templateUrl: './essay-person-details.component.html',
  styleUrls: ['./essay-person-details.component.scss']
})
export class EssayPersonDetailsComponent implements OnInit {

  constructor(public dialogRef: MatBottomSheetRef<EssayPersonDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: DialogData) { }

  ngOnInit() {
    this.data.person.formatYears();
    this.data.person.formatBirthAndDeath();
    this.data.person.setAge();
  }

}
