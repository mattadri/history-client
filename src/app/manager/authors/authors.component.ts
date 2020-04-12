import { Component, OnInit } from '@angular/core';

import { Author } from '../../models/author';

import { AuthorService } from '../../services/author.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})

export class AuthorsComponent implements OnInit {
  public authors: Author[];
  public author: Author;

  public isCreateAuthorMode: boolean;
  public isEditAuthorMode: boolean;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private authorService: AuthorService) {
    this.isCreateAuthorMode = false;
    this.isEditAuthorMode = false;

    this.initializeNewAuthor();

    this.getAuthors('/authors?sort=last_name');
  }

  initializeNewAuthor() {
    this.author = new Author();
    this.author.initializeAuthor();
  }

  ngOnInit() {
  }

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

  createAuthor(sideNav) {
    this.authorService.createApiAuthor(this.author).subscribe(response => {
      this.author.id = response.data.id;

      this.authorService.setAuthor(this.author);

      this.isCreateAuthorMode = false;

      this.closeAuthorDetails(sideNav);

      this.initializeNewAuthor();
    });
  }

  editAuthor() {
    return this.authorService.patchApiAuthor(this.author).subscribe(response => {
      this.isEditAuthorMode = false;
    });
  }

  removeAuthor(sideNav) {
    this.authorService.removeApiAuthor(this.author).subscribe(response => {
      this.authorService.removeAuthor(this.author);

      this.initializeNewAuthor();

      this.closeAuthorDetails(sideNav);
    });
  }

  openAuthorDetails(author, sideNav, isCreateMode, isEditMode) {
    this.author = author;

    if (!isCreateMode) {
      isCreateMode = false;
    }

    if (!isEditMode) {
      isEditMode = false;
    }

    this.isEditAuthorMode = isEditMode;
    this.isCreateAuthorMode = isCreateMode;

    if (sideNav.opened) {
      sideNav.close().then(done => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

  closeAuthorDetails(sideNav) {
    sideNav.close();
  }

  cancelEditCreateModes(sideNav) {
    if (this.isCreateAuthorMode) {
      this.closeAuthorDetails(sideNav);
    }

    this.isCreateAuthorMode = false;
    this.isEditAuthorMode = false;
  }

  activateCreateMode(sideNav) {
    this.isCreateAuthorMode = true;
    this.initializeNewAuthor();

    this.openAuthorDetails(this.author, sideNav, true);
  }

  turnPage(author) {
    if (author.pageIndex < author.previousPageIndex) {
      this.getAuthors(this.previousPage);
    } else if (author.pageIndex > author.previousPageIndex) {
      this.getAuthors(this.nextPage);
    }
  }
}
