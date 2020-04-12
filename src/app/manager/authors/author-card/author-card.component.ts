import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Author } from '../../../models/author';

@Component({
  selector: 'app-author-card',
  templateUrl: './author-card.component.html',
  styleUrls: ['./author-card.component.scss']
})
export class AuthorCardComponent implements OnInit {
  @Input() public author: Author;
  @Input() public isReferenceAttachment: boolean;

  @Output() private loadAuthor: EventEmitter<Author>;
  @Output() private removeAuthorFromReference: EventEmitter<Author>;

  constructor() {
    this.loadAuthor = new EventEmitter<Author>();
    this.removeAuthorFromReference = new EventEmitter<Author>();

    if (!this.isReferenceAttachment) {
      this.isReferenceAttachment = false;
    }
  }

  ngOnInit() {
  }

  onLoadDetails() {
    this.loadAuthor.emit(this.author);
  }

  doRemoveAuthorFromReference() {
    this.removeAuthorFromReference.emit(this.author);
  }
}
