import { Component, OnInit } from '@angular/core';

import { Event } from '../../models/event';
import { Era } from '../../models/era';
import { Month } from '../../models/month';
import { Reference } from '../../models/reference';

import { EventService } from '../../services/event.service';
import { MonthService } from '../../services/month.service';
import { EraService } from '../../services/era.service';
import { ReferenceService } from '../../services/reference.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public events: Event[];
  public event: Event;

  public createEventMode: boolean;

  public eras: Era[] = [];
  public months: Month[] = [];
  public references: Reference[] = [];

  constructor(private eventService: EventService,
              private referenceService: ReferenceService,
              private eraService: EraService,
              private monthService: MonthService) {

    this.events = [];

    this.initializeNewEvent();

    this.createEventMode = false;

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

    this.referenceService.getApiReferences().subscribe(references => {
      for (const reference of references) {
        this.referenceService.setReference(reference);
      }

      this.references = this.referenceService.getReferences();
    });

    this.getEvents();
  }

  ngOnInit() {
  }

  initializeNewEvent() {
    this.event = new Event();
  }

  getEvents() {
    this.eventService.getApiEvents().subscribe(events => {
      for (const event of events) {
        this.eventService.setEvent(event);
      }

      this.events = this.eventService.getEvents();
    });
  }

  createEvent(eventForm) {
    return this.eventService.createApiEvent(this.event).subscribe(returnedEvent => {
      this.eventService.setEvent(this.event);

      this.toggleCreateEvent();
      this.initializeNewEvent();
    });
  }

  toggleCreateEvent() {
    this.createEventMode = !this.createEventMode;
  }
}
