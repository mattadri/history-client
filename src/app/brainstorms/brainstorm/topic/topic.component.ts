import {Component, Input, OnInit} from '@angular/core';

import {BrainstormTopic} from '../../../models/brainstorm-topic';

@Component({
  selector: 'app-topic',
  templateUrl: './topic.component.html',
  styleUrls: ['./topic.component.scss']
})
export class TopicComponent implements OnInit {
  @Input() public topic: BrainstormTopic;

  constructor() { }

  ngOnInit() {
  }

}
