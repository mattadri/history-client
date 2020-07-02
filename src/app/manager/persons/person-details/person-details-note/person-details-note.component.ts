import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PersonNote} from '../../../../models/person-note';
import {PersonService} from '../../../../services/person.service';
import {MatDialog} from '@angular/material';
import {ConfirmRemovalComponent} from '../../../../utilities/confirm-removal/confirm-removal.component';

@Component({
  selector: 'app-person-details-note',
  templateUrl: './person-details-note.component.html',
  styleUrls: ['./person-details-note.component.scss']
})
export class PersonDetailsNoteComponent implements OnInit {
  @Input() public note: PersonNote;
  @Input() public person: Event;
  @Input() public showToolbar: boolean;

  @Output() private removeNote: EventEmitter<PersonNote>;

  public isEditNoteMode: boolean;

  constructor(public dialog: MatDialog, private personService: PersonService) {
    this.isEditNoteMode = false;

    this.removeNote = new EventEmitter<PersonNote>();
  }

  ngOnInit() {
  }

  activateEditNoteMode() {
    this.isEditNoteMode = true;
  }

  setNoteViewMode() {
    this.isEditNoteMode = false;
  }

  saveNote() {
    this.personService.patchApiPersonNote(this.note, this.person).subscribe(() => {
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
