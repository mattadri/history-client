import { Component, OnInit } from '@angular/core';

import { Event } from '../../models/event';
import { EventNote } from '../../models/event-note';
import { Era } from '../../models/era';
import { Month } from '../../models/month';
import { Source } from '../../models/reference';
import { Timeline } from '../../models/timeline';

import { EventService } from '../../services/event.service';
import { MonthService } from '../../services/month.service';
import { EraService } from '../../services/era.service';
import { SourceService } from '../../services/source.service';
import { TimelineService } from '../../services/timeline.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})

export class EventsComponent implements OnInit {
  public events: Event[];
  public event: Event;
  public eventNote: EventNote;
  public timelines: Timeline[];
  public timeline: Timeline;

  public isCreateEventMode: boolean;
  public isEditEventMode: boolean;
  public isAddNoteMode: boolean;
  public isAddTimelineMode: boolean;

  public eras: Era[] = [];
  public months: Month[] = [];
  public sources: Source[] = [];

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  // these labels are for the select options in create/edit modes.
  // they are transformed to the Month model on the event object on submit.
  public startMonthLabel: string;
  public endMonthLabel: string;

  public startEraLabel: string;
  public endEraLabel: string;

  public sourceId: number;
  public timelineId: number;

  public filterQuery: string;

  constructor(private eventService: EventService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              private timelineService: TimelineService) {

    this.events = [];

    this.initializeNewEvent();
    this.initializeNewNote();
    this.initializeNewTimeline();

    this.isCreateEventMode = false;
    this.isEditEventMode = false;
    this.isAddNoteMode = false;
    this.isAddTimelineMode = false;

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

    this.sourceService.getApiSources('/sources?sort=title').subscribe(sources => {
      for (const source of sources.sources) {
        this.sourceService.setSource(source);
      }

      this.sources = this.sourceService.getSources();
    });

    this.timelineService.getApiTimelines('/timelines?sort=modified&fields[timeline]=label').subscribe(response => {
      for (const timeline of response.timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();
    });

    this.getEvents('/events?sort=-created&page%5Bnumber%5D=1');
  }

  ngOnInit() {
  }

  initializeNewEvent() {
    this.event = new Event();

    this.event.initializeNewEvent();

    this.event.notes = [];
  }

  initializeNewNote() {
    this.eventNote = new EventNote();
  }

  initializeNewTimeline() {
    this.timeline = new Timeline();
  }

  getEvents(path, filterTerm, dateFilter) {
    this.eventService.getApiEvents(path, filterTerm, dateFilter).subscribe(response => {
      for (const event of response.events) {
        this.eventService.setEvent(event);
      }

      this.events = this.eventService.getEvents();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
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

    for (const source of this.sources) {
      if (this.sourceId === source.id) {
        this.event.source = source;
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

  cleanupRemovedEvent(contentPanel) {
    this.initializeNewEvent();
    this.closeEventDetails(contentPanel);
  }

  openEventDetails(event, sideNav, isCreateMode, isEditMode) {
    this.event = event;

    if (!isCreateMode) {
      isCreateMode = false;
    }

    this.isCreateEventMode = isCreateMode;

    if (!isEditMode) {
      isEditMode = false;
    }

    this.isAddNoteMode = false;

    if (this.event.startMonth) {
      this.startMonthLabel = this.event.startMonth.label;
    }

    if (this.event.endMonth) {
      this.endMonthLabel = this.event.endMonth.label;
    }

    if (this.event.source) {
      this.sourceId = this.event.source.id;
    }

    this.startEraLabel = this.event.startEra.label;
    this.endEraLabel = this.event.endEra.label;

    this.isEditEventMode = isEditMode;

    if (sideNav.opened) {
      sideNav.close().then(() => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

  activateCreateMode(contentPanel) {
    this.isCreateEventMode = true;
    this.initializeNewEvent();

    this.openEventDetails(this.event, contentPanel, true);
  }

  closeEventDetails(contentPanel) {
    contentPanel.close();
  }

  cancelEditMode() {
    this.isEditEventMode = false;
  }

  cancelCreateMode() {
    this.isCreateEventMode = false;
  }

  turnPage(event) {
    if (event.pageIndex < event.previousPageIndex) {
      this.getEvents(this.previousPage);
    } else if (event.pageIndex > event.previousPageIndex) {
      this.getEvents(this.nextPage);
    }
  }

  filterResults() {
    const dateFilter = [];
    let stringFilter = '';

    if (this.filterQuery.split('-').length === 2) {
      dateFilter.push(this.filterQuery.split('-')[0]);
      dateFilter.push(this.filterQuery.split('-')[1]);
    } else if (this.filterQuery) {
      stringFilter = this.filterQuery;
    }

    this.getEvents('/events?sort=-created', stringFilter, dateFilter);
  }
}
