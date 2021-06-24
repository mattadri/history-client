import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

import {BrainstormService} from '../../services/brainstorm.service';
import {Brainstorm} from '../../models/brainstorm';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-brainstorm-dialog',
  templateUrl: './add-brainstorm-dialog.component.html',
  styleUrls: ['./add-brainstorm-dialog.component.scss']
})
export class AddBrainstormDialogComponent implements OnInit {
  public brainstorms: Brainstorm[];
  public brainstorm: Brainstorm;

  constructor(public dialogRef: MatDialogRef<AddBrainstormDialogComponent>) {
    this.brainstorm = new Brainstorm();
    this.brainstorm.initializeNewBrainstorm();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveNewBrainstorm() {
    this.dialogRef.close(this.brainstorm);
  }

  async activateCreateForm() {
    await Sleep.wait(500);

     document.getElementById('new_brainstorm_title').focus();
  }
}
