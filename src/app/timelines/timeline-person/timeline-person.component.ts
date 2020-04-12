import {Component, Input, OnInit} from '@angular/core';
import {Person} from '../../models/person';

@Component({
  selector: 'app-timeline-person',
  templateUrl: './timeline-person.component.html',
  styleUrls: ['../timeline/timeline.component.scss', './timeline-person.component.scss']
})
export class TimelinePersonComponent implements OnInit {
  @Input() public person: Person;

  public positionStyle: object;
  public personIconTooltipPosition: string;

  constructor() {
    this.personIconTooltipPosition = 'above';
  }

  ngOnInit() {
    this.makePositionStyle();
  }

  makePositionStyle() {
    this.positionStyle = {
      left: this.person.timelineStartLocation + '%',
      width: this.person.timelineEndLocation + '%'
    };
  }
}
