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
  @Input() public autoEdit: boolean;
  @Input() public isCreate: boolean;

  @Output() private removeNote: EventEmitter<SourceNote>;
  @Output() private createNote: EventEmitter<SourceNote>;
  @Output() private exportNote: EventEmitter<SourceNote>;

  public isEditNoteMode: boolean;

  constructor(public dialog: MatDialog, private sourceService: SourceService) {
    this.isEditNoteMode = false;

    this.removeNote = new EventEmitter<SourceNote>();
    this.createNote = new EventEmitter<SourceNote>();
    this.exportNote = new EventEmitter<SourceNote>();
  }

  ngOnInit() { }

  activateEditNoteMode() {
    this.isEditNoteMode = true;
  }

  setNoteViewMode() {
    this.isEditNoteMode = false;
  }

  saveNote(content) {
    if (this.isCreate) {
      this.note.note = content;

      this.sourceService.createApiSourceNote(this.note, this.source).subscribe(response => {
        this.note.id = response.data.id;

        this.source.notes.unshift(this.note);

        this.isCreate = false;

        this.setNoteViewMode();

        this.createNote.emit();
      });

    } else {
      this.note.note = content;

      this.sourceService.patchApiSourceNote(this.source, this.note).subscribe(() => {
        this.setNoteViewMode();
      });
    }
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

  doExportNote() {
    this.exportNote.emit(this.note);
  }
}
