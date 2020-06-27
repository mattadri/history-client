import {Component, EventEmitter, Inject, InjectionToken, Input, OnInit, Output} from '@angular/core';

import {BrainstormThought} from '../../../models/brainstorm-thought';
import {Brainstorm} from '../../../models/brainstorm';
import {BrainstormService} from '../../../services/brainstorm.service';
import {BrainstormTopic} from '../../../models/brainstorm-topic';

import {ConfirmRemovalComponent} from '../../../utilities/confirm-removal/confirm-removal.component';
import {MatDialog} from '@angular/material';

import {MAT_DIALOG_DATA} from '../../../utilities/injectionTokens';

export interface ReturnRemoveData {
  topic: BrainstormTopic;
  thought: BrainstormThought;
}

@Component({
  selector: 'app-thought',
  templateUrl: './thought.component.html',
  styleUrls: ['./thought.component.scss']
})
export class ThoughtComponent implements OnInit {
  @Input() public brainstorm: Brainstorm;
  @Input() public topic: BrainstormTopic;
  @Input() public thought: BrainstormThought;

  @Output() private removeTopicThought: EventEmitter<ReturnRemoveData>;
  @Output() private removeBrainstormThought: EventEmitter<ReturnRemoveData>;

  public deleteReturnData: object;

  public isEditMode: boolean;

  constructor(public dialog: MatDialog,
              private brainstormService: BrainstormService) {
    this.isEditMode = false;

    this.deleteReturnData = {
      topic: null,
      thought: null
    };

    this.removeTopicThought = new EventEmitter<ReturnRemoveData>();
    this.removeBrainstormThought = new EventEmitter<ReturnRemoveData>();
  }

  ngOnInit() {
  }

  saveThought() {
    if (!this.topic) {
      this.brainstormService.patchApiBrainstormThought(this.thought).subscribe(() => { });
    } else {
      this.brainstormService.patchApiTopicThought(this.thought).subscribe(() => { });
    }

    this.cancelThoughtEditMode();
  }

  doDeleteThought() {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the thought '
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.deleteReturnData.thought = this.thought;

        if (this.topic) {
          this.deleteReturnData.topic = this.topic;

          this.removeTopicThought.emit(this.deleteReturnData);

        } else {
          this.removeBrainstormThought.emit(this.deleteReturnData);
        }

        this.cancelThoughtEditMode();
      }
    });
  }

  editThought() {
    this.isEditMode = true;
  }

  cancelThoughtEditMode() {
    this.isEditMode = false;
  }
}
