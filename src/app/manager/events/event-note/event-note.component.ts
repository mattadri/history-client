import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { EventNote } from '../../../models/events/event-note';

@Component({
  selector: 'app-event-note',
  templateUrl: './event-note.component.html',
  styleUrls: ['./event-note.component.scss']
})
export class EventNoteComponent implements OnInit {
  @Input() public note: EventNote;

  @Output() private removeNote: EventEmitter<EventNote>;

  constructor() {
    this.removeNote = new EventEmitter<EventNote>();
  }

  ngOnInit() {
  }

  doRemoveNote() {
    this.removeNote.emit(this.note);
  }
}
