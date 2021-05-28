import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import { MatDialogRef } from '@angular/material/dialog';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Timeline} from '../../../models/timelines/timeline';

import {TimelineService} from '../../../services/timeline.service';

@Component({
  selector: 'app-editor-select-timeline',
  templateUrl: './editor-select-timeline.component.html',
  styleUrls: ['./editor-select-timeline.component.scss']
})
export class EditorSelectTimelineComponent implements OnInit {
  public timelines: Timeline[];

  public responseObject: any;

  public loadAutoComplete: boolean;

  public timelinesAutocompleteControl = new FormControl();
  public timelinesFilteredOptions: Observable<Timeline[]>;
  public timelineFieldDisplayValue: string;

  constructor(public dialogRef: MatDialogRef<EditorSelectTimelineComponent>, private timelineService: TimelineService) {
    this.responseObject = {
      timeline: null
    };

    this.loadAutoComplete = false;

    this.timelineService.getApiTimelines('/timelines', null, '0', null, ['label'], null, null, null, false).subscribe(timelines => {
      for (const timeline of timelines.timelines) {
        this.timelineService.setTimeline(timeline);
      }

      this.timelines = this.timelineService.getTimelines();

      this.timelinesFilteredOptions = this.timelinesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(timeline => this._filterTimelines(timeline))
      );

      this.loadAutoComplete = true;
    });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveTimeline() {
    this.responseObject.timeline = this.timelinesAutocompleteControl.value;
  }

  displayTimeline(timeline: Timeline) {
    if (timeline) {
      this.timelineFieldDisplayValue = timeline.label;
    }

    return this.timelineFieldDisplayValue;
  }

  private _filterTimelines(filterValue: any): Timeline[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.timelines.filter(timeline => {
        return timeline.label.toLowerCase().includes(filterValue);
      });
    }
  }
}
