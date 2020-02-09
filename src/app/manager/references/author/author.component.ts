import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Author } from '../../../models/author';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {
  @Input() injectedAuthor: Author;
  @Input() editable = true;
  @Output() private removeAuthor: EventEmitter<Author>;

  public author: Author;

  constructor() {
    this.removeAuthor = new EventEmitter<Author>();
  }

  ngOnInit() {
    this.author = this.injectedAuthor;
  }

  onRemoveAuthor() {
    this.removeAuthor.emit(this.author);
  }
}
