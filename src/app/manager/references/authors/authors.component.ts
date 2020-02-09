import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Author } from '../../../models/author';

import { AuthorService } from '../../../services/author.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  @Input() authors: Author[];
  @Input() isReference: boolean;
  @Input() editable = true;

  @Output() private removeAuthor: EventEmitter<Author>;

  // authors can be removed from references or as an actual author. this var keeps up with which is which.
  private isReferenceAuthor = true;

  private newAuthor: Author = new Author();

  public addAuthorMode = false;
  public author: Author = new Author();

  constructor(private authorService: AuthorService) {
    this.removeAuthor = new EventEmitter<Author>();
  }

  ngOnInit() {
    // if no authors are passed into component then this is the authors page and all authors should be retrieved.
    if (!this.isReference) {
      this.isReferenceAuthor = false;

      this.authorService.resetAuthors();

      this.authorService.getApiAuthors().subscribe(authors => {
        for (const author of authors) {
          this.authorService.setAuthor(author);
        }

        this.authors = this.authorService.getAuthors();
      });
    }
  }

  activateAddAuthor() {
    this.addAuthorMode = true;
  }

  createAuthor() {
    this.authorService.createApiAuthor(this.author).subscribe(createdAuthor => {
      this.newAuthor.mapAuthor(createdAuthor.data);

      this.authorService.setAuthor(this.newAuthor);

      this.authors = this.authorService.getAuthors();
    });
  }

  onRemoveAuthor(author: Author) {
    // if this is removing the author from a reference then pass it upstream to reference component.
    if (this.isReferenceAuthor) {
      this.removeAuthor.emit(author);
    } else {
      // otherwise just remove the actual author
      this.authorService.removeApiAuthor(author).subscribe(result => {
        this.authorService.removeAuthor(author);
      });
    }
  }
}
