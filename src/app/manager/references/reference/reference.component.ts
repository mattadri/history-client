import { Component, OnInit, Input } from '@angular/core';
import { Reference } from '../../../models/reference';
import { Author } from '../../../models/author';
import { ReferenceService } from '../../../services/reference.service';
import { AuthorService } from '../../../services/author.service';

@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.scss']
})
export class ReferenceComponent implements OnInit {
  @Input() public reference: Reference;
  @Input() public editable = true;

  public authors: Author[];
  public newAuthor: Author;

  public showAddAuthor: boolean;

  constructor(private referenceService: ReferenceService, private authorService: AuthorService) { }

  ngOnInit() {
    this.showAddAuthor = false;
    this.initializeAuthor();
  }

  initializeAuthor() {
    this.newAuthor = new Author();
    this.newAuthor.firstName = '';
    this.newAuthor.middleName = '';
    this.newAuthor.lastName = '';
  }

  removeReference() {
    this.referenceService.removeApiReference(this.reference).subscribe(result => {
      this.referenceService.removeReference(this.reference);
    });
  }

  activateAddAuthor() {
    if (!this.authorService.getAuthors().length) {
      this.authorService.getApiAuthors().subscribe(authors => {
        for (const author of authors) {
          this.authorService.setAuthor(author);
        }

        this.authors = this.authorService.getAuthors();
      });
    } else {
      this.authors = this.authorService.getAuthors();
    }

    this.showAddAuthor = true;
  }

  addAuthor() {
    this.referenceService.createApiReferenceAuthor(this.reference, this.newAuthor).subscribe(result => {
      this.newAuthor.relationshipId = result.data.id;
      this.reference.authors.push(this.newAuthor);
    });
  }

  removeAuthor(author: Author) {
    this.referenceService.removeApiReferenceAuthor(author).subscribe(result => {
      this.referenceService.removeAuthor(this.reference, author);
    });
  }
}
