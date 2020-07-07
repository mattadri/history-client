import { Component, OnInit } from '@angular/core';

import {MatDialog} from '@angular/material';

import { Author } from '../../models/author';

import { AuthorService } from '../../services/author.service';
import {QuickAuthorComponent} from './quick-author/quick-author.component';

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

    this.getAuthors('/authors?sort=last_name&page%5Bnumber%5D=1');
  }

  ngOnInit() { }

  getAuthors(path) {
    this.authorService.getApiAuthors(path).subscribe(response => {
      for (const author of response.authors) {
        this.authorService.setAuthor(author);
      }

      this.authors = this.authorService.getAuthors();

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
      console.log('Author: ', author);
      if (author) {
        this.authorService.createApiAuthor(author).subscribe(response => {
          author.id = response.data.id;

          this.authors.unshift(author);
        });
      }
    });
  }

  removeAuthor(sideNav) {
    this.authorService.removeApiAuthor(this.author).subscribe(() => {
      this.authorService.removeAuthor(this.author);

      this.closeAuthorDetails(sideNav);
    });
  }

  openAuthorDetails(author, contentPanel) {
    this.author = author;

    this.authorLink = this.author.id;

    if (contentPanel.opened) {
      contentPanel.close().then(() => {
        contentPanel.open();
      });
    } else {
      contentPanel.open();
    }
  }

  closeAuthorDetails(sideNav) {
    sideNav.close();
  }

  turnPage(author) {
    if (author.pageIndex < author.previousPageIndex) {
      this.getAuthors(this.previousPage);
    } else if (author.pageIndex > author.previousPageIndex) {
      this.getAuthors(this.nextPage);
    }
  }
}
