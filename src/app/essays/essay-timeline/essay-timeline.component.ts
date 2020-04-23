import {Component, Input, OnInit} from '@angular/core';
import {EssayTimeline} from '../../models/essay-timeline';

@Component({
  selector: 'app-essay-timeline',
  templateUrl: './essay-timeline.component.html',
  styleUrls: ['./essay-timeline.component.scss']
})
export class EssayTimelineComponent implements OnInit {
  @Input() public essayTimeline: EssayTimeline;

  constructor() { }

  ngOnInit() {
  }

}
