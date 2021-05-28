import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Essay} from '../../models/essays/essay';

@Component({
  selector: 'app-essay-card',
  templateUrl: './essay-card.component.html',
  styleUrls: ['./essay-card.component.scss']
})
export class EssayCardComponent implements OnInit {
  @Input() essay: Essay;
  @Input() canDelete: boolean;

  @Output() private removeEssay: EventEmitter<Essay>;

  constructor() {
    this.removeEssay = new EventEmitter<Essay>();
  }

  ngOnInit() {
  }

  doRemoveEssay() {
    this.removeEssay.emit(this.essay);
  }
}
