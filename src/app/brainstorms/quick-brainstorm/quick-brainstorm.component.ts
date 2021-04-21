import { Component, OnInit, AfterViewInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import {Sleep} from '../../utilities/sleep';

import {Brainstorm} from '../../models/brainstorm';

@Component({
  selector: 'app-quick-brainstorm',
  templateUrl: './quick-brainstorm.component.html',
  styleUrls: ['./quick-brainstorm.component.scss']
})
export class QuickBrainstormComponent implements OnInit, AfterViewInit {
  public brainstorm: Brainstorm;


  constructor(public dialogRef: MatDialogRef<QuickBrainstormComponent>) {
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

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('brainstorm_title').focus();
  }
}
