import {Component, Inject, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {TimelineService} from '../../services/timeline.service';
import {Timeline} from '../../models/timelines/timeline';
import {Sleep} from '../sleep';

export interface DialogData {
  showExisting: boolean;
  showNew: boolean;
}

class QuickTimelineReturnData {
  timeline: Timeline;
  isExisting: boolean;
}

@Component({
  selector: 'app-add-timeline-dialog',
  templateUrl: './add-timeline-dialog.component.html',
  styleUrls: ['./add-timeline-dialog.component.scss']
})
export class AddTimelineDialogComponent implements OnInit {
  public timelines: Timeline[];
  public timeline: Timeline;

  public searchTimelines: Timeline[] = [];

  public timelineNameAutocompleteControl = new FormControl();
  public timelineNameFilteredOptions: Observable<Timeline[]>;

  private returnData: QuickTimelineReturnData;

  constructor(private timelineService: TimelineService,
              public dialogRef: MatDialogRef<AddTimelineDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.returnData = new QuickTimelineReturnData();

    this.timeline = new Timeline();
    this.timeline.initializeNewTimeline();

    this.timelineService.getApiTimelines('/timelines', null, '0', null, ['id', 'label'], null, null, null, false).subscribe(response => {
      this.searchTimelines = response.timelines;

      this.timelineNameFilteredOptions = this.timelineNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(timeline => this._filterTimelinesName(timeline))
      );
    });
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  saveExistingTimeline(timeline) {
    this.returnData.timeline = timeline;
    this.returnData.isExisting = true;

    this.dialogRef.close(this.returnData);
  }

  saveNewTimeline() {
    this.returnData.timeline = this.timeline;
    this.returnData.isExisting = false;

    this.dialogRef.close(this.returnData);
  }

  saveTimelineTitle(value) {
    if (value) {
      this.timeline.label = value;
    } else {
      this.timeline.label = this.timelineNameAutocompleteControl.value;
    }
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

  async activateCreateForm() {
    await Sleep.wait(500);

    try {
      document.getElementById('existing_timeline_title').focus();
    } catch(e) {
      document.getElementById('new_timeline_title').focus();
    }
  }
}
