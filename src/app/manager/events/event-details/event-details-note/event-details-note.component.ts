import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {MatDialog} from '@angular/material';

import {EventNote} from '../../../../models/event-note';
import {Event} from '../../../../models/event';

import {EventService} from '../../../../services/event.service';

import {ConfirmRemovalComponent} from '../../../../utilities/confirm-removal/confirm-removal.component';

@Component({
  selector: 'app-event-details-note',
  templateUrl: './event-details-note.component.html',
  styleUrls: ['./event-details-note.component.scss']
})
export class EventDetailsNoteComponent implements OnInit {
  @Input() public note: EventNote;
  @Input() public event: Event;
  @Input() public showToolbar: boolean;

  @Output() private removeNote: EventEmitter<EventNote>;

  public isEditNoteMode: boolean;

  constructor(public dialog: MatDialog, private eventService: EventService) {
    this.isEditNoteMode = false;

    this.removeNote = new EventEmitter<EventNote>();
  }

  ngOnInit() { }

  activateEditNoteMode() {
    this.isEditNoteMode = true;
  }

  setNoteViewMode() {
    this.isEditNoteMode = false;
  }

  saveNote() {
    this.eventService.patchApiEventNote(this.note, this.event).subscribe(() => {
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