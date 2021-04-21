import { Component, OnInit, AfterViewInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import {Sleep} from '../../../utilities/sleep';
import {BrainstormTopic} from '../../../models/brainstorm-topic';

@Component({
  selector: 'app-quick-brainstorm-topic',
  templateUrl: './quick-brainstorm-topic.component.html',
  styleUrls: ['./quick-brainstorm-topic.component.scss']
})
export class QuickBrainstormTopicComponent implements OnInit, AfterViewInit {
  public brainstormTopic: BrainstormTopic;

  constructor(public dialogRef: MatDialogRef<QuickBrainstormTopicComponent>) {
    this.brainstormTopic = new BrainstormTopic();
    this.brainstormTopic.initializeNewTopic();
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

    document.getElementById('brainstorm_topic_label').focus();
  }
}
