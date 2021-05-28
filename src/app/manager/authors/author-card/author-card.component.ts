import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Author } from '../../../models/author';

@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss']
})
export class AuthorCardComponent implements OnInit {
  @Input() public author: Author;
  @Input() public canDelete: boolean;
  @Input() public isSourceAttachment: boolean;

  @Output() private removeAuthor: EventEmitter<Author>;

  constructor() {
    this.removeAuthor = new EventEmitter<Author>();

    if (!this.isSourceAttachment) {
      this.isSourceAttachment = false;
    }
  }

  ngOnInit() { }

  doRemoveAuthor() {
    this.removeAuthor.emit(this.author);
  }
}
