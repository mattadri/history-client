import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

import {Event} from '../../models/events/event';
import {MatDialogRef} from '@angular/material/dialog';
import {EventService} from '../../services/event.service';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-existing-event-dialog',
  templateUrl: './add-existing-event-dialog.component.html',
  styleUrls: ['./add-existing-event-dialog.component.scss']
})
export class AddExistingEventDialogComponent implements OnInit {
  public searchEvents: Event[] = [];
  public eventTitleAutocompleteControl = new FormControl();
  public eventTitleFilteredOptions: Observable<Event[]>;
  public eventTitleFieldDisplayValue: string;

  constructor(private eventService: EventService, public dialogRef: MatDialogRef<AddExistingEventDialogComponent>) {
    this.eventService.getApiEvents('/events?page[size]=0&fields[event]=label',
      null, null, false).subscribe(response => {
      this.searchEvents = response.events;

      this.eventTitleFilteredOptions = this.eventTitleAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(event => this._filterEventsTitle(event))
      );
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveExistingEvent(event: Event) {
    this.dialogRef.close(event);
  }

  displayEvent(event: Event) {
    if (event) {
      this.eventTitleFieldDisplayValue = '';

      if (event.label) {
        this.eventTitleFieldDisplayValue = event.label;
      }
    }

    return this.eventTitleFieldDisplayValue;
  }

  private _filterEventsTitle(filterValue: any): Event[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchEvents.filter(event => {
        if (event.label) {
          return event.label.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('existing_event_title').focus();
  }
}
