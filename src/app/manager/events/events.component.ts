import { Component, OnInit } from '@angular/core';

import {MatDialog} from '@angular/material';

import { Event } from '../../models/event';

import { EventService } from '../../services/event.service';

import {ConfirmRemovalComponent} from '../../utilities/confirm-removal/confirm-removal.component';
import {QuickEventComponent} from './quick-event/quick-event.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})

export class EventsComponent implements OnInit {
  public events: Event[];
  public event: Event;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  public filterQuery: string;

  public eventLink: string;

  constructor(private eventService: EventService,
              public dialog: MatDialog) {

    this.events = [];

    this.getEvents('/events?sort=-created&page%5Bnumber%5D=1', null, null);
  }

  ngOnInit() {
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
      dateFilter.push(this.filterQuery.split('-')[0]);
      dateFilter.push(this.filterQuery.split('-')[1]);
    } else if (this.filterQuery) {
      stringFilter = this.filterQuery;
    }

    this.getEvents('/events?sort=-created', stringFilter, dateFilter);
  }
}
