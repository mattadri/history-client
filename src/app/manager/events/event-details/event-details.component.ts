import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

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

  @Input() public timelineId: number;

  @Output() private fullyCancelEditMode: EventEmitter<void>;
  @Output() private doCleanupRemovedEvent: EventEmitter<any>;

  public timelineEvent: TimelineEvent;

  public isAddNoteMode: boolean;
  public isAddTimelineMode: boolean;
  public eventNote: EventNote;
  public timeline: Timeline;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  public source: Source;

  constructor(private eventService: EventService,
              private timelineService: TimelineService) {

    this.fullyCancelEditMode = new EventEmitter();
    this.doCleanupRemovedEvent = new EventEmitter();

    this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
      startWith(''),
      map(source => this._filterSources(source))
    );
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
    if (!this.event.startDay) {
      this.event.startDay = null;
    }

    if (!this.event.endDay) {
      this.event.endDay = null;
    }

    if (this.startMonthLabel === null) {
      this.event.startMonth = new Month();
      this.event.startMonth.label = '';
      this.event.startMonth.id = null;
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
      this.event.endMonth.id = null;
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

    return this.eventService.patchApiEvent(this.event).subscribe(() => {
      this.cancelEditMode();
    });
  }

  saveSource() {
    this.event.source = this.sourcesAutocompleteControl.value;
  }

  displaySource(source: Source) {
    if (source) {
      this.sourceFieldDisplayValue = source.title;

      if (source.subTitle) {
        this.sourceFieldDisplayValue = this.sourceFieldDisplayValue + ': ' + source.subTitle;
      }
    }

    return this.sourceFieldDisplayValue;
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
      EventService.removeEventNote(this.event, note);
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

  private _filterSources(filterValue: any): Source[] {
    // when a source is actually selected the value is changed to the source itself. Do not filter if that is the case.
    if (!filterValue.id) {
      filterValue = filterValue.toLowerCase();

      return this.sources.filter(source => {
        return source.title.toLowerCase().includes(filterValue);
      });
    }
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
