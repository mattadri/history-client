import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {SourceService} from '../../../services/source.service';
import {EraService} from '../../../services/era.service';
import {MonthService} from '../../../services/month.service';
import {AuthorService} from '../../../services/author.service';

import {Source} from '../../../models/source';
import {SourceNote} from '../../../models/source-note';
import {Era} from '../../../models/era';
import {Month} from '../../../models/month';
import {Author} from '../../../models/author';
import {SourceNoteExportComponent} from '../source-note-export/source-note-export.component';
import {MatDialog} from '@angular/material';
import {BrainstormService} from '../../../services/brainstorm.service';
import {BrainstormThought} from '../../../models/brainstorm-thought';

@Component({
  selector: 'app-source-details',
  templateUrl: './source-details.component.html',
  styleUrls: ['./source-details.component.scss']
})
export class SourceDetailsComponent implements OnInit {
  public source: Source;
  public note: SourceNote;
  public author: Author;

  public eras: Era[];
  public months: Month[];

  public displayAuthors: string;

  public isAddNoteMode: boolean;
  public isAddAuthorMode: boolean;
  public isEditSourceMode: boolean;

  public authors: Author[];

  public authorsAutocompleteControl = new FormControl();
  public authorsFilteredOptions: Observable<Author[]>;
  public authorFieldDisplayValue: string;

  constructor(private route: ActivatedRoute,
              private sourceService: SourceService,
              private eraService: EraService,
              private monthService: MonthService,
              private authorService: AuthorService,
              private brainstormService: BrainstormService,
              public dialog: MatDialog) {

    const sourceId = this.route.snapshot.paramMap.get('id');

    this.isAddNoteMode = false;
    this.isEditSourceMode = false;
    this.isAddAuthorMode = true;

    this.eras = [];
    this.months = [];

    this.authorService.getApiAuthors('/authors?page[size]=0&fields[author]=first_name,last_name').subscribe(authors => {
        for (const author of authors.authors) {
          this.authorService.setAuthor(author);
        }

        this.authors = this.authorService.getAuthors();

        this.authorsFilteredOptions = this.authorsAutocompleteControl.valueChanges.pipe(
          startWith(''),
          map(author => this._filterAuthors(author))
        );
      });

    this.eraService.getEras().subscribe(eras => {
      for (const era of eras.data) {
        this.eras.push(new Era().mapEra(era));
      }
    });

    this.monthService.getMonths().subscribe(months => {
      for (const month of months.data) {
        this.months.push(new Month().mapMonth(month));
      }
    });

    this.sourceService.getApiSource(Number.parseInt(sourceId, 10)).subscribe(source => {
      this.source = source;

      this.sourceService.setSource(this.source);

      this.makeAuthorsDisplay();
    });
  }

  ngOnInit() { }

  initializeNewNote() {
    this.note = new SourceNote();
    this.note.initializeNote();
  }

  makeAuthorsDisplay() {
    this.displayAuthors = '';

    for (const author of this.source.authors) {
      if (this.displayAuthors.length) {
        this.displayAuthors = this.displayAuthors + ', ';
      }

      this.displayAuthors = this.displayAuthors + author.firstName;

      if (author.middleName) {
        this.displayAuthors = this.displayAuthors + ' ' + author.middleName;
      }

      if (author.lastName) {
        this.displayAuthors = this.displayAuthors + ' ' + author.lastName;
      }
    }
  }

  editSource() {
    return this.sourceService.patchApiSource(this.source).subscribe(() => {
      this.deactivateEditSourceMode();

      this.makeAuthorsDisplay();

      this.source.formatPublishedDate();
    });
  }

  activateEditSourceMode() {
    this.isEditSourceMode = true;
  }

  deactivateEditSourceMode() {
    this.makeAuthorsDisplay();

    this.isEditSourceMode = false;
  }

  activateAddNoteMode() {
    this.isAddNoteMode = true;

    this.initializeNewNote();
  }

  deactivateAddNoteMode() {
    this.isAddNoteMode = false;
  }

  activateAddAuthorMode() {
    this.isAddAuthorMode = true;
  }

  deactivateAddAuthorMode() {
    this.isAddAuthorMode = false;
  }

  selectMonth(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }

  selectEra(option, value) {
    if (value && option) {
      return option.id === value.id;
    } else {
      return null;
    }
  }

  saveNote() {
    this.sourceService.createApiSourceNote(this.note, this.source).subscribe(response => {
      if (!this.source.notes) {
        this.source.notes = [];
      }

      this.note.id = response.data.id;
      this.source.notes.push(this.note);

      this.initializeNewNote();

      this.deactivateAddNoteMode();
    });
  }

  deleteNote(note: SourceNote) {
    this.sourceService.removeApiNote(note).subscribe(() => {
      SourceService.removeNote(this.source, note);
    });
  }

  saveAuthor() {
    this.author = this.authorsAutocompleteControl.value;

    return this.sourceService.createApiSourceAuthor(this.source, this.author).subscribe(response => {
      this.author.id = response.data.id;

      this.isAddAuthorMode = false;

      this.source.authors.push(this.author);
    });
  }

  removeAuthor(author: Author) {
    this.sourceService.removeApiSourceAuthor(author).subscribe(() => {
      this.sourceService.removeAuthor(this.source, author);
    });
  }

  exportNotes() {
    const dialogRef = this.dialog.open(SourceNoteExportComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(brainstorm => {
      if (brainstorm) {
        for(let i = 0; i < this.source.notes.length; i++) {
          let thought: BrainstormThought = new BrainstormThought();

          thought.initializeNewThought();
          thought.thought = this.source.notes[i].note;
          thought.position = i;
          thought.brainstormId = brainstorm.id;

          this.brainstormService.createApiBrainstormThought(thought).subscribe(() => {});

          this.sourceService.createApiSourceNoteBrainstorm(this.source.notes[i], brainstorm).subscribe(() => {
            this.source.notes[i].exportBrainstorms.push(brainstorm);
          });
        }
      }
    });
  }

  loadExportNote(note) {
    const dialogRef = this.dialog.open(SourceNoteExportComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(brainstorm => {
      if (brainstorm) {
        let thought: BrainstormThought = new BrainstormThought();

        thought.initializeNewThought();
        thought.thought = note.note;
        thought.position = brainstorm.thoughts.length + 1;
        thought.brainstormId = brainstorm.id;

        this.brainstormService.createApiBrainstormThought(thought).subscribe(() => {});

        note.exportBrainstorms.push(brainstorm);

        this.sourceService.createApiSourceNoteBrainstorm(note, brainstorm).subscribe(() => {
          note.exportBrainstorms.push(brainstorm);
        });
      }
    });
  }

  displayAuthor(author: Author) {
    if (author) {
      this.authorFieldDisplayValue = author.firstName;

      if (author.lastName) {
        this.authorFieldDisplayValue += ' ' + author.lastName;
      }
    }

    return this.authorFieldDisplayValue;
  }

  private _filterAuthors(filterValue: any): Author[] {
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.authors.filter(author => {
        return author.firstName.toLowerCase().includes(filterValue) || author.lastName.toLowerCase().includes(filterValue);
      });
    }
  }
}
