import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { Author } from '../../models/author';

import { AuthorService } from '../../services/author.service';
import {QuickAuthorComponent} from './quick-author/quick-author.component';
import {ConfirmRemovalComponent} from '../../utilities/confirm-removal/confirm-removal.component';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})

export class AuthorsComponent implements OnInit {
  public authors: Author[];
  public author: Author;

  public authorLink: string;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private authorService: AuthorService, public dialog: MatDialog) {
    this.author = new Author();
    this.author.initializeAuthor();

    this.authorLink = '';

    this.getAuthors(null, ['last_name'], false);
  }

  ngOnInit() { }

  getAuthors(path, sort, isAnotherPage) {
    this.authorService.getApiAuthors(path, null, null, null, null, sort, false, null, isAnotherPage).subscribe(response => {
      this.authors = response.authors;

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  createAuthor() {
    const dialogRef = this.dialog.open(QuickAuthorComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(author => {
      if (author) {
        this.authorService.createApiAuthor(author).subscribe(response => {
          author.id = response.data.id;

          this.authors.unshift(author);
        });
      }
    });
  }

  removeAuthor(author) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the author ' + author.firstName + ' ' + author.lastName,
        content: ''
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.authorService.removeApiAuthor(author).subscribe(() => {
          this.authorService.removeAuthor(author);
        });
      }
    });
  }

  turnPage(author) {
    if (author.pageIndex < author.previousPageIndex) {
      this.getAuthors(this.previousPage, null, true);
    } else if (author.pageIndex > author.previousPageIndex) {
      this.getAuthors(this.nextPage, null, true);
    }
  }
}
