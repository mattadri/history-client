import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { Event } from '../../models/event';
import { EventNote } from '../../models/event-note';
import { Era } from '../../models/era';
import { Month } from '../../models/month';
import { Source } from '../../models/source';
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

  public timelineId: number;

  public filterQuery: string;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

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

    this.getEvents('/events?sort=-created&page%5Bnumber%5D=1', null, null);
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
    this.eventService.getApiEvents(path, filterTerm, dateFilter, false).subscribe(response => {
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

    return this.eventService.createApiEvent(this.event).subscribe(response => {
      this.event.id = response.data.id;

      this.eventService.setEvent(this.event);

      this.isCreateEventMode = false;
      this.isEditEventMode = false;

      this.openEventDetails(this.event, contentPanel, false, false);
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

  activateCreateMode(contentPanel) {
    this.isCreateEventMode = true;
    this.initializeNewEvent();

    this.openEventDetails(this.event, contentPanel, true, false);
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
      this.getEvents(this.previousPage, null, null);
    } else if (event.pageIndex > event.previousPageIndex) {
      this.getEvents(this.nextPage, null, null);
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
