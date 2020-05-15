import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';

import {MatDialog} from '@angular/material/dialog';

import {SourceNote} from '../../../../models/source-note';

import {ConfirmRemovalComponent} from '../../../../utilities/confirm-removal/confirm-removal.component';

import {SourceService} from '../../../../services/source.service';
import {Source} from '../../../../models/source';

@Component({
  selector: 'app-source-details-note',
  templateUrl: './source-details-note.component.html',
  styleUrls: ['./source-details-note.component.scss']
})
export class SourceDetailsNoteComponent implements OnInit {
  @Input() public note: SourceNote;
  @Input() public source: Source;
  @Input() public showToolbar: boolean;

  @Output() private removeNote: EventEmitter<SourceNote>;

  public isEditNoteMode: boolean;

  constructor(public dialog: MatDialog, private sourceService: SourceService) {
    this.isEditNoteMode = false;

    this.removeNote = new EventEmitter<SourceNote>();
  }

  ngOnInit() {
    console.log(this.note);
  }

  activateEditNoteMode() {
    this.isEditNoteMode = true;
  }

  setNoteViewMode() {
    this.isEditNoteMode = false;
  }

  saveNote() {
    this.sourceService.patchApiSourceNote(this.source, this.note).subscribe(() => {
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
