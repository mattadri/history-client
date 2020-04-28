import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {EssayTimeline} from '../../models/essay-timeline';

@Component({
  selector: 'app-essay-timeline',
  templateUrl: './essay-timeline.component.html',
  styleUrls: ['./essay-timeline.component.scss']
})
export class EssayTimelineComponent implements OnInit {
  @Input() public essayTimeline: EssayTimeline;

  @Output() private timelineSelected: EventEmitter<EssayTimeline>;
  @Output() private delselectAllEssayTimelines: EventEmitter<any>;

  public selectedTimeline: EssayTimeline;
  public timelineIsSelected: boolean;

  constructor(private elementRef: ElementRef,
              private renderer: Renderer2) {
    this.timelineSelected = new EventEmitter<EssayTimeline>();
    this.delselectAllEssayTimelines = new EventEmitter<any>();
    this.timelineIsSelected = false;
  }

  ngOnInit() {
  }

  applySelectState() {
    const el = this.elementRef.nativeElement.querySelector('#timeline-container');

    this.renderer.addClass(el, 'essay-timeline-selected');
  }

  async onSelectTimeline() {
    this.timelineIsSelected = !this.timelineIsSelected;
    this.delselectAllEssayTimelines.emit();

    await this.sleep(200);

    this.applySelectState();
    this.timelineSelected.emit(this.selectedTimeline);
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
