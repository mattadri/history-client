import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Author } from '../../../models/author';

@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss']
})
export class AuthorCardComponent implements OnInit {
  @Input() public author: Author;
  @Input() public isSourceAttachment: boolean;

  @Output() private loadAuthor: EventEmitter<Author>;
  @Output() private removeAuthorFromSource: EventEmitter<Author>;

  constructor() {
    this.loadAuthor = new EventEmitter<Author>();
    this.removeAuthorFromSource = new EventEmitter<Author>();

    if (!this.isSourceAttachment) {
      this.isSourceAttachment = false;
    }
  }

  ngOnInit() {
  }

  onLoadDetails() {
    this.loadAuthor.emit(this.author);
  }

  doRemoveAuthorFromSource() {
    this.removeAuthorFromSource.emit(this.author);
  }
}
