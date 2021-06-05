import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Event} from '../../../models/events/event';
import {EventNote} from '../../../models/events/event-note';
import {Timeline} from '../../../models/timelines/timeline';
import {Source} from '../../../models/source';
import {Era} from '../../../models/era';
import {Month} from '../../../models/month';

import {EventService} from '../../../services/event.service';
import {TimelineService} from '../../../services/timeline.service';
import {SourceService} from '../../../services/source.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';
import {ConfirmRemovalComponent} from '../../../utilities/confirm-removal/confirm-removal.component';
import {MatDialog} from '@angular/material/dialog';
import {EventTimeline} from '../../../models/events/event-timeline';
import {AddTimelineDialogComponent} from '../../../utilities/add-timeline-dialog/add-timeline-dialog.component';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  public event: Event;
  public note: EventNote;
  public eventTimelines: EventTimeline[];

  public sources: Source[] = [];

  public eras: Era[] = [];
  public months: Month[] = [];

  public isAddNoteMode: boolean;
  public isAddTimelineMode: boolean;
  public isEditEventMode: boolean;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  public isSavingImage: boolean;

  constructor(private route: ActivatedRoute,
              private eventService: EventService,
              private timelineService: TimelineService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              public dialog: MatDialog,) {

    const eventId = this.route.snapshot.paramMap.get('id');

    this.eventTimelines = [];

    this.isSavingImage = false;

    this.eventService.getApiEvent(eventId).subscribe(event => {
      this.event = event;

      if (!this.event.description.length) {
        this.event.description = 'Needs a description.';
      }

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

      // GET THE TIMELINES THE EVENT IS ATTACHED TO
      this.eventService.getApiEventTimelines(this.event).subscribe((response) => {
        this.eventTimelines = response.eventTimelines;
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

  deactivateEditEventMode() {
    this.isEditEventMode = false;
  }

  deactivateAddNoteMode() {
    this.isAddNoteMode = false;
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

  addEventTimeline() {
    const dialogRef = this.dialog.open(AddTimelineDialogComponent, {
      width: '750px',
      data: {
        showExisting: true,
        showNew: false
      }
    });

    dialogRef.afterClosed().subscribe(timelineObj => {
      let eventTimeline = new EventTimeline();
      eventTimeline.initializeNewEventTimeline();

      eventTimeline.timeline = timelineObj.timeline;

      console.log(eventTimeline);

      this.eventService.createTimelineApiEvent(eventTimeline, this.event).subscribe(response => {
        eventTimeline.id = response.data.id;

        // get the full timeline now that we have it to show on the card. The previous timeline was a
        // truncated version for selection purposes only.
        this.timelineService.getApiTimeline(timelineObj.timeline.id).subscribe(timeline => {
          eventTimeline.timeline = timeline;

          this.eventTimelines.unshift(eventTimeline);
        });
      });
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

  saveImage(e: File[]) {
    if (e.length) {
      this.isSavingImage = true;

      const file = e[0];
      const imageForm = new FormData();
      imageForm.append('image', file);

      this.eventService.createApiEventImage(imageForm).subscribe((eventImageResponse) => {
        this.event.image = eventImageResponse;

        this.eventService.patchApiEvent(this.event).subscribe(() => {
          this.isSavingImage = false;
        });
      });
    }
  }

  deleteNote(note: EventNote) {
    this.eventService.removeApiNote(note).subscribe(() => {
      EventService.removeEventNote(this.event, note);
    });
  }

  deleteTimeline(timeline: Timeline) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the timeline ' + timeline.label
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        let eventTimelineToDelete: EventTimeline = null;

        for (const eventTimeline of this.eventTimelines) {
          if (eventTimeline.timeline.id === timeline.id) {
            eventTimelineToDelete = eventTimeline;
            break;
          }
        }

        if (eventTimelineToDelete) {
          this.eventService.removeTimelineApiEvent(eventTimelineToDelete).subscribe(() => {
            for (let i = 0; i < this.eventTimelines.length; i++) {
              if (this.eventTimelines[i].id === eventTimelineToDelete.id) {
                this.eventTimelines.splice(i, 1);
              }
            }
          });
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
