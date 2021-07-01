import { Component, OnInit } from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {Source} from '../../models/source';
import {Era} from '../../models/era';
import {Month} from '../../models/month';
import {Event} from '../../models/events/event';
import {MonthService} from '../../services/month.service';
import {EraService} from '../../services/era.service';
import {SourceService} from '../../services/source.service';
import {EventService} from '../../services/event.service';
import {MatDialogRef} from '@angular/material/dialog';
import {Sleep} from '../sleep';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.scss']
})
export class AddEventDialogComponent implements OnInit {
  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  public searchEvents: Event[] = [];
  public eventTitleAutocompleteControl = new FormControl();
  public eventTitleFilteredOptions: Observable<Event[]>;
  public eventTitleFieldDisplayValue: string;

  public eras: Era[] = [];
  public months: Month[] = [];
  public sources: Source[] = [];

  public event: Event;

  constructor(private eventService: EventService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              public dialogRef: MatDialogRef<AddEventDialogComponent>) {
    this.event = new Event();
    this.event.initializeNewEvent();

    this.eras = this.eraService.getCachedEras();

    if (!this.eras.length) {
      this.eraService.getEras().subscribe(eras => {
        for (const returnedEra of eras.data) {
          const era: Era = new Era();
          era.initializeNewEra();
          era.mapEra(returnedEra);

          this.eraService.setEra(era);
        }

        this.eras = this.eraService.getCachedEras();
      });
    }

    this.months = this.monthService.getCachedMonths();

    if (!this.months.length) {
      this.monthService.getMonths().subscribe(months => {
        for (const returnedMonth of months.data) {
          const month: Month = new Month();
          month.initializeNewMonth();
          month.mapMonth(returnedMonth);

          this.monthService.setMonth(month);
        }

        this.months = this.monthService.getCachedMonths();
      });
    }

    this.sourceService.getApiSources(null, '0', null, null, ['title', 'sub_title'], null, false, null, false).subscribe(sources => {
      for (const source of sources.sources) {
        this.sourceService.setSource(source);
      }

      this.sources = this.sourceService.getSources();

      this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(source => this._filterSources(source))
      );
    });

    this.eventService.getApiEvents(
      null, '0', null, null, ['label'], null, false, null, false).subscribe(response => {

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

  saveSource() {
    this.event.source = this.sourcesAutocompleteControl.value;
  }

  saveEventTitle(value) {
    if (value) {
      this.event.label = value;
    } else {
      this.event.label = this.eventTitleAutocompleteControl.value;
    }
  }

  saveNewEvent() {
    this.dialogRef.close(this.event);
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

  displayEvent(event: Event) {
    if (event) {
      this.eventTitleFieldDisplayValue = '';

      if (event.label) {
        this.eventTitleFieldDisplayValue = event.label;
      }
    }

    return this.eventTitleFieldDisplayValue;
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

    document.getElementById('event_label').focus();
  }
}
