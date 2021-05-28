import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {EssayService} from '../../services/essay.service';

import {EssayNote} from '../../models/essays/essay-note';
import {Essay} from '../../models/essays/essay';

import {ConfirmRemovalComponent} from '../../utilities/confirm-removal/confirm-removal.component';

@Component({
  selector: 'app-essay-note',
  templateUrl: './essay-note.component.html',
  styleUrls: ['./essay-note.component.scss']
})
export class EssayNoteComponent implements OnInit {
  @Input() public note: EssayNote;
  @Input() public essay: Essay;
  @Input() public showToolbar: boolean;

  @Output() private removeNote: EventEmitter<EssayNote>;

  public isEditNoteMode: boolean;

  constructor(public dialog: MatDialog, private essayService: EssayService) {
    this.isEditNoteMode = false;

    this.removeNote = new EventEmitter<EssayNote>();
  }

  ngOnInit() { }

  activateEditNoteMode() {
    this.isEditNoteMode = true;
  }

  setNoteViewMode() {
    this.isEditNoteMode = false;
  }

  saveNote() {
    this.essayService.patchApiEssayNote(this.essay, this.note).subscribe(() => {
      this.setNoteViewMode();
    });
  }

  doDeleteNote() {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the note '
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.removeNote.emit(this.note);
      }
    });
  }
}
