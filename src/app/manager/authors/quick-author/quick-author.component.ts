import { Component, OnInit, AfterViewInit } from '@angular/core';
import {AuthorService} from '../../../services/author.service';
import {Author} from '../../../models/author';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {map, startWith} from 'rxjs/operators';

import {Sleep} from '../../../utilities/sleep';

@Component({
  selector: 'app-quick-author',
  templateUrl: './quick-author.component.html',
  styleUrls: ['./quick-author.component.scss']
})
export class QuickAuthorComponent implements OnInit, AfterViewInit {
  public searchAuthors: Author[] = [];

  public authorFirstNameAutocompleteControl = new FormControl();
  public authorFirstNameFilteredOptions: Observable<Author[]>;
  public authorFirstNameFieldDisplayValue: string;

  public authorLastNameAutocompleteControl = new FormControl();
  public authorLastNameFilteredOptions: Observable<Author[]>;
  public authorLastNameFieldDisplayValue: string;

  public author: Author;

  constructor(private authorService: AuthorService,
              public dialogRef: MatDialogRef<QuickAuthorComponent>) {

    this.author = new Author();
    this.author.initializeAuthor();


    this.authorService.getApiAuthors(null, '0', null, null, ['first_name', 'last_name'], ['last_name'], false, null, false)
      .subscribe(response => {

      this.searchAuthors = response.authors;

      this.authorFirstNameFilteredOptions = this.authorFirstNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(author => this._filterAuthorsFirstName(author))
      );

      this.authorLastNameFilteredOptions = this.authorLastNameAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(author => this._filterAuthorsLastName(author))
      );
    });
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.activateCreateForm().then();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveAuthorFirstName(value) {
    if (value) {
      this.author.firstName = value;
    } else {
      this.author.firstName = this.authorFirstNameAutocompleteControl.value;
    }
  }

  saveAuthorLastName(value) {
    if (value) {
      this.author.lastName = value;
    } else {
      this.author.lastName = this.authorFirstNameAutocompleteControl.value;
    }
  }

  displayAuthorFirstName(author: Author) {
    if (author) {
      this.authorFirstNameFieldDisplayValue = '';

      if (author.firstName) {
        this.authorFirstNameFieldDisplayValue = author.firstName;
      }
    }

    return this.authorFirstNameFieldDisplayValue;
  }

  displayAuthorLastName(author: Author) {
    if (author) {
      this.authorLastNameFieldDisplayValue = '';

      if (author.lastName) {
        this.authorLastNameFieldDisplayValue = author.lastName;
      }
    }

    return this.authorLastNameFieldDisplayValue;
  }

  private _filterAuthorsFirstName(filterValue: any): Author[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchAuthors.filter(author => {
        if (author.firstName) {
          return author.firstName.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }

  private _filterAuthorsLastName(filterValue: any): Author[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.searchAuthors.filter(author => {
        if (author.lastName) {
          return author.lastName.toLowerCase().includes(filterValue);
        } else {
          return '';
        }
      });
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('author_first_name').focus();
  }
}
