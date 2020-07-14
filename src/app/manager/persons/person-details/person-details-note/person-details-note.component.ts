import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {PersonNote} from '../../../../models/person-note';
import {PersonService} from '../../../../services/person.service';
import {MatDialog} from '@angular/material';
import {ConfirmRemovalComponent} from '../../../../utilities/confirm-removal/confirm-removal.component';
import {Person} from '../../../../models/person';

@Component({
  selector: 'app-person-details-note',
  templateUrl: './person-details-note.component.html',
  styleUrls: ['./person-details-note.component.scss']
})
export class PersonDetailsNoteComponent implements OnInit {
  @Input() public note: PersonNote;
  @Input() public person: Person;
  @Input() public showToolbar: boolean;
  @Input() public autoEdit: boolean;
  @Input() public isCreate: boolean;

  @Output() private removeNote: EventEmitter<PersonNote>;
  @Output() private createNote: EventEmitter<PersonNote>;

  public isEditNoteMode: boolean;

  constructor(public dialog: MatDialog, private personService: PersonService) {
    this.isEditNoteMode = false;

    this.removeNote = new EventEmitter<PersonNote>();
    this.createNote = new EventEmitter<PersonNote>();
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

      this.personService.createApiPersonNote(this.note, this.person).subscribe(response => {
        this.note.id = response.data.id;

        this.person.notes.unshift(this.note);

        this.isCreate = false;

        this.setNoteViewMode();

        this.createNote.emit();
      });

    } else {
      this.personService.patchApiPersonNote(this.note, this.person).subscribe(() => {
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
}
