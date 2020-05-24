import { Component, OnInit } from '@angular/core';

import {ActivatedRoute} from '@angular/router';

import {Event} from '../../../models/event';
import {EventNote} from '../../../models/event-note';

import {EventService} from '../../../services/event.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  public event: Event;
  public note: EventNote;

  public isAddNoteMode: boolean;

  constructor(private route: ActivatedRoute, private eventService: EventService) {
    const eventId = this.route.snapshot.paramMap.get('id');

    this.eventService.getApiEvent(eventId).subscribe(event => {
      this.event = event;

      this.eventService.setEvent(this.event);

      this.event.formatYears();
      this.event.formatDates();

      console.log(this.event);
    });

    this.isAddNoteMode = false;
  }

  ngOnInit() { }

  initializeNewNote() {
    this.note = new EventNote();
    this.note.initializeNote();
  }

  activateAddNoteMode() {
    this.isAddNoteMode = true;

    this.initializeNewNote();
  }

  deactivateAddNoteMode() {
    this.isAddNoteMode = false;
  }

  saveNote() {
    this.eventService.createApiEventNote(this.note, this.event).subscribe(response => {
      if (!this.event.notes) {
        this.event.notes = [];
      }

      this.note.id = response.data.id;
      this.event.notes.push(this.note);

      this.initializeNewNote();

      this.isAddNoteMode = false;
    });
  }

  deleteNote(note: EventNote) {
    this.eventService.removeApiNote(note).subscribe(() => {
      EventService.removeEventNote(this.event, note);
    });
  }
}
