import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {PersonNote} from '../../../models/persons/person-note';

@Component({
  selector: 'app-person-note',
  templateUrl: './person-note.component.html',
  styleUrls: ['./person-note.component.scss']
})
export class PersonNoteComponent implements OnInit {
  @Input() public note: PersonNote;

  @Output() private removeNote: EventEmitter<PersonNote>;

  constructor() {
    this.removeNote = new EventEmitter<PersonNote>();
  }

  ngOnInit() {
  }

  doRemoveNote() {
    this.removeNote.emit(this.note);
  }
}
