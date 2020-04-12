import {Component, Input, OnInit} from '@angular/core';

import {MatDialog} from '@angular/material';

import {Person} from '../../models/person';
import {Timeline} from '../../models/timeline';

import { TimelinePersonDetailsComponent } from '../timeline-person-details/timeline-person-details.component';

@Component({
  selector: 'app-timeline-person-list',
  templateUrl: './timeline-person-list.component.html',
  styleUrls: ['./timeline-person-list.component.scss']
})
export class TimelinePersonListComponent implements OnInit {
  @Input() public person: Person;
  @Input() public timeline: Timeline;

  public isSelected: boolean;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.isSelected = false;
  }

  applyColorClass() {
    let classes = 'timeline-listed-event-key';

    if (this.person.colorClass) {
      classes = classes + ' color-' + this.person.colorClass;
    }

    return classes;
  }

  showDetails() {
    this.dialog.open(TimelinePersonDetailsComponent, {
      width: '500px',
      data: {
        person: this.person,
        timeline: this.timeline
      }
    });
  }
}
