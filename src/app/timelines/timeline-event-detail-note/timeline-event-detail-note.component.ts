import { Component, OnInit, Input } from '@angular/core';

import { EventNote } from '../../models/event-note';

@Component({
  selector: 'app-timeline-event-detail-note',
  templateUrl: './timeline-event-detail-note.component.html',
  styleUrls: ['./timeline-event-detail-note.component.scss']
})
export class TimelineEventDetailNoteComponent implements OnInit {
  @Input() public note: EventNote;

  constructor() { }

  ngOnInit() {
  }
}
