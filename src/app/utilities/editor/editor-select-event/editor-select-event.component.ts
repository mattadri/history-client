import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {MatDialogRef} from '@angular/material';

import {Event} from '../../../models/event';

import {EventService} from '../../../services/event.service';

@Component({
  selector: 'app-editor-select-event',
  templateUrl: './editor-select-event.component.html',
  styleUrls: ['./editor-select-event.component.scss']
})
export class EditorSelectEventComponent implements OnInit {
  public events: Event[];

  public responseObject: any;

  public loadAutoComplete: boolean;

  public eventsAutocompleteControl = new FormControl();
  public eventsFilteredOptions: Observable<Event[]>;
  public eventFieldDisplayValue: string;

  constructor(public dialogRef: MatDialogRef<EditorSelectEventComponent>, private eventService: EventService) {
    this.responseObject = {
      event: null
    };

    this.loadAutoComplete = false;

    this.eventService.getApiEvents('/events?page[size]=0&fields[event]=label&sort=label', null, null, false).subscribe(events => {
      for (const event of events.events) {
        this.eventService.setEvent(event);
      }

      this.events = this.eventService.getEvents();

      this.eventsFilteredOptions = this.eventsAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(event => this._filterEvents(event))
      );

      this.loadAutoComplete = true;
    });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveEvent() {
    this.responseObject.event = this.eventsAutocompleteControl.value;
  }

  displayEvent(event: Event) {
    if (event) {
      this.eventFieldDisplayValue = event.label;
    }

    return this.eventFieldDisplayValue;
  }

  private _filterEvents(filterValue: any): Event[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.events.filter(event => {
        return event.label.toLowerCase().includes(filterValue);
      });
    }
  }
}
