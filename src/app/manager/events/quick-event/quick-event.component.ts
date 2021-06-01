import {Component, OnInit, AfterViewInit, Inject} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Sleep} from '../../../utilities/sleep';

import {SourceService} from '../../../services/source.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';

import {Source} from '../../../models/source';
import {Event} from '../../../models/events/event';
import {Era} from '../../../models/era';
import {Month} from '../../../models/month';
import {EventService} from '../../../services/event.service';

export interface DialogData {
  showExisting: boolean;
  showNew: boolean;
}

class QuickEventReturnData {
  event: Event;
  isExisting: boolean;
}

@Component({
  selector: 'app-quick-event',
  templateUrl: './quick-event.component.html',
  styleUrls: ['./quick-event.component.scss']
})
export class QuickEventComponent implements OnInit, AfterViewInit {
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

  private returnData: QuickEventReturnData;

  constructor(private eventService: EventService,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public dialogRef: MatDialogRef<QuickEventComponent>) {

    this.event = new Event();
    this.event.initializeNewEvent();

    this.returnData = new QuickEventReturnData();

    this.eraService.getEras().subscribe(eras => {
      for (const era of eras.data) {
        const newEra = new Era().mapEra(era);

        // set to AD so that drop-downs auto populate with the value.
        if (newEra.label === 'AD') {
          this.event.startEra = newEra;
          this.event.endEra = newEra;
        }

        this.eras.push(newEra);
      }
    });

    this.monthService.getMonths().subscribe(months => {
      for (const month of months.data) {
        this.months.push(new Month().mapMonth(month));
      }
    });

    this.sourceService.getApiSources('/references?page[size]=0&fields[reference]=title,sub_title').subscribe(sources => {
      for (const source of sources.sources) {
        this.sourceService.setSource(source);
      }

      this.sources = this.sourceService.getSources();

      this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(source => this._filterSources(source))
      );
    });

    this.eventService.getApiEvents('/events?page[size]=0&fields[event]=label',
      null, null, false).subscribe(response => {
      this.searchEvents = response.events;

      this.eventTitleFilteredOptions = this.eventTitleAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(event => this._filterEventsTitle(event))
      );
    });
  }

  ngOnInit() { }

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

  saveExistingEvent(event: Event) {
    this.returnData.event = event;
    this.returnData.isExisting = true;

    this.dialogRef.close(this.returnData);
  }

  saveNewEvent() {
    this.returnData.event = this.event;
    this.returnData.isExisting = false;

    this.dialogRef.close(this.returnData);
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

    try {
      document.getElementById('existing_event_title').focus();
    } catch(e) {
      document.getElementById('event_label').focus();
    }
  }
}
