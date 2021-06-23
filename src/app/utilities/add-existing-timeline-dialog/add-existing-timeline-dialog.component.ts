import { Component, OnInit } from '@angular/core';
import {map, startWith} from 'rxjs/operators';
import {Timeline} from '../../models/timelines/timeline';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {Sleep} from '../sleep';
import {TimelineService} from '../../services/timeline.service';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-existing-timeline-dialog',
  templateUrl: './add-existing-timeline-dialog.component.html',
  styleUrls: ['./add-existing-timeline-dialog.component.scss']
})
export class AddExistingTimelineDialogComponent implements OnInit {
  public timelines: Timeline[];
  public timeline: Timeline;

  public searchTimelines: Timeline[] = [];

  public timelineNameAutocompleteControl = new FormControl();
  public timelineNameFilteredOptions: Observable<Timeline[]>;

  constructor(public dialogRef: MatDialogRef<AddExistingTimelineDialogComponent>,
              private timelineService: TimelineService) {
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

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('existing_timeline_title').focus();
  }
}
