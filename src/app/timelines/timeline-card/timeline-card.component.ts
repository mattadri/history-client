import { Component, OnInit, Input } from '@angular/core';

import { Timeline } from '../../models/timeline';

@Component({
  selector: 'app-timeline-card',
  templateUrl: './timeline-card.component.html',
  styleUrls: ['./timeline-card.component.scss']
})
export class TimelineCardComponent implements OnInit {
  @Input() public timeline: Timeline;

  constructor() { }

  ngOnInit() {
  }

}
