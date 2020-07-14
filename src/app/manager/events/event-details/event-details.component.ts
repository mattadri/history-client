import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Event} from '../../../models/event';
import {EventNote} from '../../../models/event-note';
import {Timeline} from '../../../models/timeline';
import {TimelineEvent} from '../../../models/timeline-event';
import {Source} from '../../../models/source';
import {Era} from '../../../models/era';
import {Month} from '../../../models/month';

import {EventService} from '../../../services/event.service';
import {TimelineService} from '../../../services/timeline.service';
import {SourceService} from '../../../services/source.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  public event: Event;
  public note: EventNote;
  public timeline: Timeline;
  public timelineEvent: TimelineEvent;

  public sources: Source[] = [];
  public timelines: Timeline[] = [];

  public eras: Era[] = [];
  public months: Month[] = [];

  public isAddNoteMode: boolean;
  public isAddTimelineMode: boolean;
  public isEditEventMode: boolean;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  constructor(private route: ActivatedRoute,
              private eventService: EventService,
              private timelineService: TimelineService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService) {

    const eventId = this.route.snapshot.paramMap.get('id');

    this.eventService.getApiEvent(eventId).subscribe(event => {
      this.event = event;

      this.eventService.setEvent(this.event);

      this.sourcesAutocompleteControl.setValue(this.event.source);

      // LOAD REMAINING DATA AFTER THE INITIAL EVENT HAS BEEN RETRIEVED
      this.eraService.getEras().subscribe(eras => {
        for (const era of eras.data) {
          this.eras.push(new Era().mapEra(era));
        }
      });

      this.monthService.getMonths().subscribe(months => {
        for (const month of months.data) {
          this.months.push(new Month().mapMonth(month));
        }
      });

      this.sourceService.getApiSources('/references?page[size]=0&fields[reference]=title,sub_title&sort=title').subscribe(sources => {
        for (const source of sources.sources) {
          this.sourceService.setSource(source);
        }

        this.sources = this.sourceService.getSources();

        this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
          startWith(''),
          map(source => this._filterSources(source))
        );
      });

      this.timelineService.getApiTimelines('/timelines?sort=modified&fields[timeline]=label').subscribe(response => {
        for (const timeline of response.timelines) {
          this.timelineService.setTimeline(timeline);
        }

        this.timelines = this.timelineService.getTimelines();
      });
    });

    this.isEditEventMode = false;
    this.isAddNoteMode = false;
    this.isAddTimelineMode = false;
  }

  ngOnInit() { }

  initializeNewNote() {
    this.note = new EventNote();
    this.note.initializeNote();
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();
  }

  selectEra(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }

  selectMonth(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }

  activateEditEventMode() {
    this.isEditEventMode = true;
  }

  activateAddNoteMode() {
    this.isAddNoteMode = true;

    this.initializeNewNote();
  }

  activateAddTimelineMode() {
    this.isAddTimelineMode = true;
  }

  deactivateEditEventMode() {
    this.isEditEventMode = false;
  }

  deactivateAddNoteMode() {
    this.isAddNoteMode = false;
  }

  deactivateAddTimelineMode() {
    this.isAddTimelineMode = false;
  }

  saveSource() {
    this.event.source = this.sourcesAutocompleteControl.value;
  }

  saveDescription(content) {
    this.event.description = content;

    this.editEvent();
  }

  editEvent() {
    return this.eventService.patchApiEvent(this.event).subscribe(() => {
      this.isEditEventMode = false;
    });
  }

  saveTimelineEvent() {
    this.timelineEvent = new TimelineEvent();
    this.timelineEvent.event = this.event;
    this.timelineEvent.timeline = this.timeline;

    // call service
    this.timelineService.createEventApiTimeline(this.timelineEvent).subscribe(response => {
      this.timelineEvent.id = response.data.id;
      this.timeline.eventId = this.timelineEvent.id;

      this.event.timelines.push(this.timeline);

      this.initializeNewTimeline();

      this.isAddTimelineMode = false;
    });
  }

  saveNote() {
    this.eventService.createApiEventNote(this.note, this.event).subscribe(response => {
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

  deleteTimeline(timeline) {
    this.timelineService.removeEventApiTimeline(timeline.eventId).subscribe(() => {
      for (let i = 0; i < this.event.timelines.length; i++) {
        if (this.event.timelines[i].id === timeline.id) {
          this.event.timelines.splice(i, 1);
        }
      }
    });
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

  private _filterSources(filterValue: any): Source[] {
    // when a source is actually selected the value is changed to the source itself. Do not filter if that is the case.
    if (!filterValue.id) {
      filterValue = filterValue.toLowerCase();

      return this.sources.filter(source => {
        return source.title.toLowerCase().includes(filterValue);
      });
    }
  }
}
