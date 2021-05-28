import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {EssayEvent} from '../../models/essays/essay-event';

@Component({
  selector: 'app-essay-event',
  templateUrl: './essay-event.component.html',
  styleUrls: ['./essay-event.component.scss']
})
export class EssayEventComponent implements OnInit {
  @Input() public essayEvent: EssayEvent;

  @Output() private eventSelected: EventEmitter<EssayEvent>;
  @Output() private delselectAllEssayEvents: EventEmitter<any>;

  public selectedEvent: EssayEvent;
  public eventIsSelected: boolean;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
    this.eventSelected = new EventEmitter<EssayEvent>();
    this.delselectAllEssayEvents = new EventEmitter<any>();
    this.eventIsSelected = false;
  }

  ngOnInit() {
  }

  applySelectState() {
    const el = this.elementRef.nativeElement.querySelector('#event-container');

    this.renderer.addClass(el, 'essay-event-selected');
  }

  async onSelectEvent() {
    this.eventIsSelected = !this.eventIsSelected;
    this.delselectAllEssayEvents.emit();

    await this.sleep(200);

    this.applySelectState();
    this.eventSelected.emit(this.selectedEvent);
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
