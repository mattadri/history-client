import { Component, OnInit } from '@angular/core';
import {map, startWith} from 'rxjs/operators';

import {Timeline} from '../../../../models/timelines/timeline';
import {TimelineService} from '../../../../services/timeline.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-person-details-add-timeline',
  templateUrl: './person-details-add-timeline.component.html',
  styleUrls: ['./person-details-add-timeline.component.scss']
})
export class PersonDetailsAddTimelineComponent implements OnInit {
  public timelines: Timeline[];

  public searchTimelines: Timeline[] = [];

  public timelineNameAutocompleteControl = new FormControl();
  public timelineNameFilteredOptions: Observable<Timeline[]>;

  constructor(private timelineService: TimelineService,
              public dialogRef: MatDialogRef<PersonDetailsAddTimelineComponent>) {
    this.timelineService.getApiTimelines('/timelines', null, '0', null, ['label'], ['label'], false, null, false).subscribe(response => {

      this.searchTimelines = response.timelines;

      this.timelineNameFilteredOptions = this.timelineNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(timeline => this._filterTimelinesName(timeline))
      );
    });
  }

  ngOnInit(): void {
  }

  saveTimeline(timeline) {
    this.dialogRef.close(timeline);
  }

  private _filterTimelinesName(filterValue: any): Timeline[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchTimelines.filter(timeline => {
        if (timeline.label) {
          return timeline.label.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }
}
