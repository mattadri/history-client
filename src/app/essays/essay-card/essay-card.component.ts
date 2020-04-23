import {Component, Input, OnInit} from '@angular/core';
import {Essay} from '../../models/essay';

@Component({
  selector: 'app-essay-card',
  templateUrl: './essay-card.component.html',
  styleUrls: ['./essay-card.component.scss']
})
export class EssayCardComponent implements OnInit {
  @Input() essay: Essay;

  constructor() { }

  ngOnInit() {
  }

}
