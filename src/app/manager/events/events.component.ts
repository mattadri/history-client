import { Component, OnInit } from '@angular/core';

import { Event } from '../../models/event';
import { EventNote } from '../../models/event-note';
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
  public eventNote: EventNote;

  public isCreateEventMode: boolean;
  public isEditEventMode: boolean;
  public isAddNoteMode: boolean;

  public eras: Era[] = [];
  public months: Month[] = [];
  public references: Reference[] = [];

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  // these labels are for the select options in create/edit modes.
  // they are transformed to the Month model on the event object on submit.
  public startMonthLabel: string;
  public endMonthLabel: string;

  public startEraLabel: string;
  public endEraLabel: string;

  public referenceId: number;

  constructor(private eventService: EventService,
              private referenceService: ReferenceService,
              private eraService: EraService,
              private monthService: MonthService) {

    this.events = [];

    this.initializeNewEvent();
    this.initializeNewNote();

    this.isCreateEventMode = false;
    this.isEditEventMode = false;
    this.isAddNoteMode = false;

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

    this.getEvents('/events?sort=label');
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

  getEvents(path) {
    this.eventService.getApiEvents(path).subscribe(response => {
      for (const event of response.events) {
        this.eventService.setEvent(event);
      }

      this.events = this.eventService.getEvents();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  activateCreateMode(sideNav) {
    this.isCreateEventMode = true;
    this.initializeNewEvent();

    this.openEventDetails(this.event, sideNav, true);
  }

  createEvent(sideNav) {
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

      this.closeEventDetails(sideNav);

      this.initializeNewEvent();
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
    if (!this.event.startDay || !this.event.startDay.length) {
      this.event.startDay = 'null';
    }

    if (!this.event.endDay || !this.event.endDay.length) {
      this.event.endDay = 'null';
    }

    if (this.startMonthLabel === null) {
      this.event.startMonth = new Month();
      this.event.startMonth.label = '';
      this.event.startMonth.id = 'null';
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
      this.event.endMonth.id = 'null';
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

    return this.eventService.patchApiEvent(this.event).subscribe(response => {
      this.isEditEventMode = false;

      if (this.event.startDay === 'null') {
        this.event.startDay = '';
      }

      if (this.event.endDay === 'null') {
        this.event.endDay = '';
      }
    });
  }

  removeEvent(sideNav) {
    this.eventService.removeApiEvent(this.event).subscribe(response => {
      this.eventService.removeEvent(this.event);

      this.initializeNewEvent();

      this.closeEventDetails(sideNav);
    });
  }

  removeNote(note) {
    this.eventService.removeApiNote(note).subscribe(response => {
      this.eventService.removeEventNote(this.event, note);
    });
  }

  openEventDetails(event, sideNav, isCreateMode, isEditMode) {
    this.event = event;

    if (!isCreateMode) {
      isCreateMode = false;
    }

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

    if (this.event.reference) {
      this.referenceId = this.event.reference.id;
    }

    this.startEraLabel = this.event.startEra.label;
    this.endEraLabel = this.event.endEra.label;

    this.isEditEventMode = isEditMode;
    this.isCreateEventMode = isCreateMode;

    if (sideNav.opened) {
      sideNav.close().then(done => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

  closeEventDetails(sideNav) {
    sideNav.close();
  }

  cancelEditCreateModes(sideNav) {
    if (this.isCreateEventMode) {
      this.closeEventDetails(sideNav);
    }

    this.isCreateEventMode = false;
    this.isEditEventMode = false;
    this.isAddNoteMode = false;
  }

  turnPage(event) {
    if (event.pageIndex < event.previousPageIndex) {
      this.getEvents(this.previousPage);
    } else if (event.pageIndex > event.previousPageIndex) {
      this.getEvents(this.nextPage);
    }
  }

  cancelEventNoteForm() {
    this.isAddNoteMode = false;
    this.initializeNewNote();
  }
}
