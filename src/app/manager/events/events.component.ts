import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Event } from '../../models/event';

import { EventService } from '../../services/event.service';

import {ConfirmRemovalComponent} from '../../utilities/confirm-removal/confirm-removal.component';
import {QuickEventComponent} from './quick-event/quick-event.component';
import {TimelineService} from '../../services/timeline.service';
import {Timeline} from '../../models/timeline';
import {TimelineEvent} from '../../models/timeline-event';

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

    this.getEvents(
      '/events?sort=-created&page%5Bnumber%5D=1&fields[event]=label,description,event_start_day,event_start_month,event_start_year,' +
      'event_start_era,event_end_day,event_end_month,event_end_year,event_end_era,reference',
      null, null);

    this.timelineService.getApiTimelines('/timelines?fields[timeline]=label&sort=-label&page[size]=0').subscribe((response) => {
      for (const timeline of response.timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();
    });
  }

  ngOnInit() {
  }

  getEvents(path, filterTerm, dateFilter) {
    if (this.selectedEvents.length) {
      if (!this.staticSelectedEvents.length) {
        this.staticSelectedEvents = [...this.selectedEvents];
      } else {
        this.staticSelectedEvents = this.staticSelectedEvents.concat(this.selectedEvents);

        this.removeDuplicatesFromSelectedEventsList();
      }
    }

    this.eventService.getApiEvents(path, filterTerm, dateFilter, false).subscribe(response => {
      for (const event of response.events) {
        this.eventService.setEvent(event);
      }

      this.events = this.eventService.getEvents();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;

      this.selectedEvents = this.staticSelectedEvents;
    });
  }

  createEvent() {
    const dialogRef = this.dialog.open(QuickEventComponent, {
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

  removeEvent(contentPanel) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the event ',
        content: '' +
        '<li>' + this.event.notes.length.toString() + ' notes will be removed.</li>' +
        '<li>Will impact ' + this.event.timelines.length + ' timelines.</li>'
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.eventService.removeApiEvent(this.event).subscribe(() => {
          this.eventService.removeEvent(this.event);
          this.cleanupRemovedEvent(contentPanel);
        });
      }
    });
  }

  cleanupRemovedEvent(contentPanel) {
    this.closeEventDetails(contentPanel);
  }

  openEventDetails(event, sideNav) {
    this.event = event;

    this.eventLink = this.event.id.toString();

    if (sideNav.opened) {
      sideNav.close().then(() => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

  closeEventDetails(contentPanel) {
    contentPanel.close();
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

    this.getEvents('/events?sort=-created', stringFilter, dateFilter);
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

    console.log('Saving Events: ', this.selectedEvents);
    console.log('To Timeline: ', this.selectedTimeline);

    for (const event of this.selectedEvents) {
      // create the event for the timeline
      this.timelineEvent = new TimelineEvent();
      this.timelineEvent.event = event;
      this.timelineEvent.timeline = this.selectedTimeline;

      // call service
      this.timelineService.createEventApiTimeline(this.timelineEvent).subscribe(() => { });
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
