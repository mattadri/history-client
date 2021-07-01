import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Event } from '../../models/events/event';

import { EventService } from '../../services/event.service';

import {TimelineService} from '../../services/timeline.service';
import {Timeline} from '../../models/timelines/timeline';
import {TimelineEvent} from '../../models/timelines/timeline-event';
import {AddEventDialogComponent} from '../../utilities/add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})

export class EventsComponent implements OnInit {
  public events: Event[];
  public event: Event;
  public selectedEvents: Event[];
  public staticSelectedEvents: Event[];

  public timelines: Timeline[];
  public selectedTimeline: Timeline;

  public timelineEvent: TimelineEvent;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  public filterQuery: string;

  public eventLink: string;

  public eventLayout: string;

  constructor(private eventService: EventService,
              private timelineService: TimelineService,
              public dialog: MatDialog) {
    this.eventLayout = 'card';

    this.events = [];
    this.selectedEvents = [];
    this.staticSelectedEvents = [];

    this.timelines = [];

    this.getEvents(null, null, null, ['created'], true, false);

    this.timelineService.getApiTimelines('/timelines', null, '0', null, ['label'], ['label'], true, null, false).subscribe((response) => {
      this.timelines = response.timelines;
    });
  }

  ngOnInit() {
  }

  getEvents(path, filterTerm: string, dateFilter: Array<string>, sort: Array<string>, sortDescending: boolean, isAnotherPage: boolean) {
    if (this.selectedEvents.length) {
      if (!this.staticSelectedEvents.length) {
        this.staticSelectedEvents = [...this.selectedEvents];
      } else {
        this.staticSelectedEvents = this.staticSelectedEvents.concat(this.selectedEvents);

        this.removeDuplicatesFromSelectedEventsList();
      }
    }

    let additionalFilters = [];

    if (filterTerm) {
      const searchFilter = {
        or: [
          {
            name: 'description',
            op: 'ilike',
            val: '%' + filterTerm + '%'
          },
          {
            name: 'label',
            op: 'ilike',
            val: '%' + filterTerm + '%'
          }
        ]
      };

      additionalFilters.push(searchFilter);
    }

    if (dateFilter) {
      if (dateFilter.length === 2) {
        let addEraFilter = true;

        let startDateOperator = 'gt';

        if (dateFilter[0][1].toUpperCase() === 'BC') {
          startDateOperator = 'lt';
        }

        let endDateOperator = 'lt';

        if (dateFilter[1][1].toUpperCase() === 'BC') {
          endDateOperator = 'gt';
        }

        // In the case that the search is between BC and AD
        if (dateFilter[0][1].toUpperCase() === 'BC' && dateFilter[1][1].toUpperCase() === 'AD') {
          addEraFilter = false;
        }

        const startDateFilter = {
          name: 'event_start_year',
          op: startDateOperator,
          val: dateFilter[0][0]
        };

        const endDateFilter = {
          name: 'event_end_year',
          op: endDateOperator,
          val: dateFilter[1][0]
        };

        const startDateEraFilter = {
          name: 'event_start_era_rel',
          op: 'has',
          val: {
            name: 'label',
            op: 'eq',
            val: dateFilter[0][1]
          }
        };

        const endDateEraFilter = {
          name: 'event_end_era_rel',
          op: 'has',
          val: {
            name: 'label',
            op: 'eq',
            val: dateFilter[1][1]
          }
        };

        additionalFilters.push(startDateFilter);
        additionalFilters.push(endDateFilter);

        if (addEraFilter) {
          additionalFilters.push(startDateEraFilter);
          additionalFilters.push(endDateEraFilter);
        }
      }
    }

    this.eventService.getApiEvents(
      path,
      null,
      null,
      null,
      ['label', 'description', 'image', 'event_start_year', 'event_start_era', 'event_end_year', 'event_end_era'],
      sort,
      sortDescending,
      additionalFilters,
      isAnotherPage).subscribe(response => {

      this.events = response.events;

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;

      this.selectedEvents = this.staticSelectedEvents;
    });
  }

  createEvent() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(event => {
      if (event) {
        this.eventService.createApiEvent(event).subscribe(response => {
          event.id = response.data.id;

          event.formatDates();
          event.formatYears();

          this.events.unshift(event);
        });
      }
    });
  }

  turnPage(event) {
    if (event.pageIndex < event.previousPageIndex) {
      this.getEvents(this.previousPage, null, null, null, false, true);
    } else if (event.pageIndex > event.previousPageIndex) {
      this.getEvents(this.nextPage, null, null, null, false, true);
    }
  }

  filterResults() {
    const dateFilter = [];
    let stringFilter = '';

    if (this.filterQuery.split('-').length === 2) {
      let startDateEra = 'AD';
      let endDateEra = 'AD';

      let startDateYear = null;
      let endDateYear = null;

      const startDateInfo = [];
      const endDateInfo = [];

      let startDate = this.filterQuery.split('-')[0].trim();
      let endDate = this.filterQuery.split('-')[1].trim();

      if (startDate.split(' ').length === 2) {
        if (startDate.split(' ')[1] === 'AD' || startDate.split(' ')[1] === 'BC') {
          startDateEra = startDate.split(' ')[1];
          startDateYear = startDate.split(' ')[0];
        } else {
          startDateYear = startDate;
        }
      } else {
        startDateYear = startDate;
      }

      if (endDate.split(' ').length === 2) {
        if (endDate.split(' ')[1].toUpperCase() === 'AD' || endDate.split(' ')[1].toUpperCase() === 'BC') {
          endDateEra = endDate.split(' ')[1];
          endDateYear = endDate.split(' ')[0];
        } else {
          endDateYear = endDate;
        }
      } else {
        endDateYear = endDate;
      }

      startDateInfo.push(startDateYear, startDateEra);
      endDateInfo.push(endDateYear, endDateEra);

      dateFilter.push(startDateInfo);
      dateFilter.push(endDateInfo);

    } else if (this.filterQuery) {
      stringFilter = this.filterQuery;
    }

    this.getEvents(null, stringFilter, dateFilter, ['created'], true, false);
  }

  addToTimeline() {
    this.removeDuplicatesFromSelectedEventsList();

    this.selectedEvents = this.selectedEvents.concat(this.staticSelectedEvents);

    // removes the duplicates from the final list
    this.selectedEvents = this.selectedEvents.filter((event, index, self) =>
      index === self.findIndex((t) => (
        t.id === event.id
      ))
    );

    for (const event of this.selectedEvents) {
      // create the event for the timeline
      this.timelineEvent = new TimelineEvent();
      this.timelineEvent.event = event;

      // call service
      this.timelineService.createEventApiTimeline(this.timelineEvent, this.selectedTimeline).subscribe(() => { });
    }
  }

  removeDuplicatesFromSelectedEventsList() {
    this.staticSelectedEvents = this.staticSelectedEvents.filter((event, index, self) =>
      index === self.findIndex((t) => (
        t.id === event.id
      ))
    );
  }

  selectEvent(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }
}
