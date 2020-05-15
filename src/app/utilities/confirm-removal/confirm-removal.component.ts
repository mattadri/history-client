import {Component, Inject, OnInit} from '@angular/core';

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  label: string;
}

@Component({
  selector: 'app-confirm-removal',
  templateUrl: './confirm-removal.component.html',
  styleUrls: ['./confirm-removal.component.scss']
})
export class ConfirmRemovalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmRemovalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
