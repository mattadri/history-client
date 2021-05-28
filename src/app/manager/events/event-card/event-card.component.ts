import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Event } from '../../../models/events/event';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() public event: Event;
  @Input() public canDelete: boolean;

  @Output() private removeEvent: EventEmitter<Event>;

  constructor() {
    this.removeEvent = new EventEmitter<Event>();
  }

  ngOnInit() { }

  doRemoveEvent() {
    this.removeEvent.emit(this.event);
  }
}
