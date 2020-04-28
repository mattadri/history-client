import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Event } from '../../../models/event';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss']
})
export class EventCardComponent implements OnInit {
  @Input() public event: Event;

  @Output() private loadEvent: EventEmitter<Event>;

  constructor() {
    this.loadEvent = new EventEmitter<Event>();
  }

  ngOnInit() {
    this.event.formatYears();
    this.event.formatYears();
  }

  onLoadDetails() {
    this.loadEvent.emit(this.event);
  }
}
