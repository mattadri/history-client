import { Component, OnInit, Input } from '@angular/core';

import { Event } from '../../../models/event';

import { EventService } from '../../../services/event.service';
import { EventNote } from '../../../models/event-note';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  public note: EventNote;

  public addNoteComponent: boolean;

  @Input() public event: Event;

  constructor(private eventService: EventService) {
    this.addNoteComponent = false;
    this.note = new EventNote();
  }

  ngOnInit() {
    if (!this.event.notes) {
      this.event.notes = [];
    }
  }

  toggleAddNote() {
    this.addNoteComponent = !this.addNoteComponent;
  }

  removeEvent() {
    console.log('Removing Event: ', this.event);
    this.eventService.removeApiEvent(this.event).subscribe(result => {
      this.eventService.removeEvent(this.event);
    });
  }

  removeNote(note: EventNote) {
    this.eventService.removeApiNote(note).subscribe(result => {
      this.eventService.removeEventNote(this.event, note);
    });
  }

  createNote() {
    this.eventService.createApiEventNote(this.note, this.event).subscribe(result => {
      this.note.id = result.data.id;
      this.event.notes.push(this.note);
    });
  }
}
