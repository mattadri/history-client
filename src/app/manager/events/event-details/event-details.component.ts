import { Component, OnInit, Input } from '@angular/core';

import {Event} from '../../models/event';

import {TimelineService} from '../../../services/timeline.service';
import {MonthService} from '../../../services/month.service';
import {ReferenceService} from '../../../services/reference.service';
import {EraService} from '../../../services/era.service';

import {Month} from '../../../models/month';
import {Era} from '../../../models/era';
import {Reference} from '../../../models/reference';
import {Timeline} from '../../../models/timeline';
import {EventNote} from '../../../models/event-note';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})

export class EventDetailsComponent implements OnInit {
  @Input() public event: Event;
  @Input() public editOnly: boolean;
  @Input() public createOnly: boolean;
  @Input() public contentPanel;

  public isCreateEventMode: boolean;
  public isEditEventMode: boolean;
  public isAddNoteMode: boolean;
  public isAddTimelineMode: boolean;

  public eras: Era[] = [];
  public months: Month[] = [];
  public references: Reference[] = [];

  // these labels are for the select options in create/edit modes.
  // they are transformed to the Month model on the event object on submit.
  public startMonthLabel: string;
  public endMonthLabel: string;

  public startEraLabel: string;
  public endEraLabel: string;

  public referenceId: number;
  public timelineId: number;

  constructor(private referenceService: ReferenceService,
              private eraService: EraService,
              private monthService: MonthService,
              private timelineService: TimelineService) {

    this.isCreateEventMode = this.createOnly;

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

    this.referenceService.getApiReferences('/references?sort=title').subscribe(references => {
      for (const reference of references.references) {
        this.referenceService.setReference(reference);
      }

      this.references = this.referenceService.getReferences();
    });

    this.timelineService.getApiTimelines('/timelines?sort=modified&fields[timeline]=label').subscribe(response => {
      for (const timeline of response.timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();
    });

    console.log('Boolean: ', this.isCreateEventMode);
  }

  ngOnInit() {
    if (!this.isCreateEventMode) {
      if (this.event.startMonth) {
        this.startMonthLabel = this.event.startMonth.label;
      }

      if (this.event.endMonth) {
        this.endMonthLabel = this.event.endMonth.label;
      }

      if (this.event.reference) {
        this.referenceId = this.event.reference.id;
      }

      this.startEraLabel = this.event.startEra.label;
      this.endEraLabel = this.event.endEra.label;
    }
  }

  initializeNewNote() {
    this.eventNote = new EventNote();
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
  }

  createEvent(contentPanel) {
    // set the era objects
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

    for (const month of this.months) {
      if (this.startMonthLabel === month.label) {
        this.event.startMonth = month;
      }
    }

    for (const month of this.months) {
      if (this.endMonthLabel === month.label) {
        this.event.endMonth = month;
      }
    }

    for (const reference of this.references) {
      if (this.referenceId === reference.id) {
        this.event.reference = reference;
      }
    }

    return this.eventService.createApiEvent(this.event).subscribe(response => {
      this.event.id = response.data.id;

      this.eventService.setEvent(this.event);

      this.isCreateEventMode = false;
      this.isEditEventMode = false;

      this.openEventDetails(this.event, contentPanel);
    });
  }
}
