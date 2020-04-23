import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {TimelineService} from '../../../services/timeline.service';
import {EventService} from '../../../services/event.service';

import {Month} from '../../../models/month';
import {Era} from '../../../models/era';
import {Event} from '../../../models/event';
import {Source} from '../../../models/source';
import {Timeline} from '../../../models/timeline';
import {EventNote} from '../../../models/event-note';
import {TimelineEvent} from '../../../models/timeline-event';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})

export class EventDetailsComponent implements OnInit {
  @Input() public event: Event;
  @Input() public editOnly: boolean;
  @Input() public allowDelete: boolean;
  @Input() public contentPanel: object;

  @Input() public eras: Era[];
  @Input() public months: Month[];
  @Input() public sources: Source[];
  @Input() public timelines: Timeline[];

  // these labels are for the select options in create/edit modes.
  // they are transformed to the Month model on the event object on submit.
  @Input() public startMonthLabel: string;
  @Input() public endMonthLabel: string;

  @Input() public startEraLabel: string;
  @Input() public endEraLabel: string;

  @Input() public sourceId: number;
  @Input() public timelineId: number;

  @Output() private fullyCancelEditMode: EventEmitter;
  @Output() private doCleanupRemovedEvent: EventEmitter;

  public timelineEvent: TimelineEvent;

  public isAddNoteMode: boolean;
  public isAddTimelineMode: boolean;
  public eventNote: EventNote;
  public timeline: Timeline;

  constructor(private eventService: EventService,
              private timelineService: TimelineService) {

    this.fullyCancelEditMode = new EventEmitter();
    this.doCleanupRemovedEvent = new EventEmitter();
  }

  ngOnInit() { }

  initializeNewNote() {
    this.eventNote = new EventNote();
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
  }

  createTimelineEvent() {
    for (const timeline of this.timelines) {
      if (this.timelineId === timeline.id) {
        this.timeline = timeline;
      }
    }

    this.timelineEvent = new TimelineEvent();
    this.timelineEvent.event = this.event;
    this.timelineEvent.timeline = this.timeline;

    // call service
    this.timelineService.createEventApiTimeline(this.timelineEvent).subscribe(response => {
      if (!this.event.timelines) {
        this.event.timelines = [];
      }

      this.timelineEvent.id = response.data.id;
      this.timeline.eventId = this.timelineEvent.id;

      this.event.timelines.push(this.timeline);

      this.initializeNewTimeline();

      this.isAddTimelineMode = false;
    });
  }

  createNote() {
    this.eventService.createApiEventNote(this.eventNote, this.event).subscribe(result => {
      if (!this.event.notes) {
        this.event.notes = [];
      }

      this.eventNote.id = result.data.id;
      this.event.notes.push(this.eventNote);

      this.initializeNewNote();

      this.isAddNoteMode = false;
    });
  }

  editEvent() {
    if (!this.event.startDay || !this.event.startDay.length) {
      this.event.startDay = 'null';
    }

    if (!this.event.endDay || !this.event.endDay.length) {
      this.event.endDay = 'null';
    }

    if (this.startMonthLabel === null) {
      this.event.startMonth = new Month();
      this.event.startMonth.label = '';
      this.event.startMonth.id = 'null';
    }

    if (this.startMonthLabel) {
      for (const month of this.months) {
        if (this.startMonthLabel === month.label) {
          this.event.startMonth = month;
        }
      }
    }

    if (this.endMonthLabel === null) {
      this.event.endMonth = new Month();
      this.event.endMonth.label = '';
      this.event.endMonth.id = 'null';
    }

    if (this.endMonthLabel) {
      for (const month of this.months) {
        if (this.endMonthLabel === month.label) {
          this.event.endMonth = month;
        }
      }
    }

    for (const era of this.eras) {
      if (this.startEraLabel === era.label) {
        this.event.startEra = era;
      }
    }

    for (const era of this.eras) {
      if (this.endEraLabel === era.label) {
        this.event.endEra = era;
      }
    }

    if (this.sourceId) {
      for (const source of this.sources) {
        if (this.sourceId === source.id) {
          this.event.source = source;
        }
      }
    }

    return this.eventService.patchApiEvent(this.event).subscribe(() => {
      if (this.event.startDay === 'null') {
        this.event.startDay = '';
      }

      if (this.event.endDay === 'null') {
        this.event.endDay = '';
      }

      this.cancelEditMode();
    });
  }

  removeEvent(contentPanel) {
    this.eventService.removeApiEvent(this.event).subscribe(() => {
      this.eventService.removeEvent(this.event);

      // call parent to close the content panel and initialize a new event
      this.doCleanupRemovedEvent.emit(contentPanel);
    });
  }

  removeNote(note) {
    this.eventService.removeApiNote(note).subscribe(() => {
      this.eventService.removeEventNote(this.event, note);
    });
  }

  removeTimeline(timeline) {
    this.timelineService.removeEventApiTimeline(timeline.eventId).subscribe(() => {
      for (let i = 0; i < this.event.timelines.length; i++) {
        if (this.event.timelines[i].id === timeline.id) {
          this.event.timelines.splice(i, 1);
        }
      }
    });
  }

  async activateEventNoteForm() {
    this.isAddNoteMode = true;
    this.initializeNewNote();

    await this.sleep(500);

    document.getElementById('event_note').focus();
  }

  cancelEditMode() {
    this.editOnly = false;

    // send back to parent to update the edit mode there.
    this.fullyCancelEditMode.emit();
  }

  cancelEventNoteForm() {
    this.isAddNoteMode = false;
    this.initializeNewNote();
  }

  cancelEventTimelineForm() {
    this.isAddTimelineMode = false;
    this.initializeNewTimeline();
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
