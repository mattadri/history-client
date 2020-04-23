import { Component, OnInit } from '@angular/core';

import { SourceService } from '../../services/source.service';
import { MonthService } from '../../services/month.service';
import { EraService } from '../../services/era.service';
import { AuthorService } from '../../services/author.service';

import { Source } from '../../models/source';
import { Month } from '../../models/month';
import { Era } from '../../models/era';
import { Author } from '../../models/author';
import { SourceNote } from '../../models/source-note';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})

export class SourcesComponent implements OnInit {
  public sources: Source[] = [];
  public source: Source;

  public eras: Era[] = [];
  public months: Month[] = [];
  public authors: Author[] = [];
  public author: Author;
  public sourceNote: SourceNote;

  public isCreateSourceMode: boolean;
  public isEditSourceMode: boolean;
  public isAddAuthorMode: boolean;
  public isAddNoteMode: boolean;

  public publishedMonthLabel: string;
  public publishedEraLabel: string;
  public authorId: number;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private sourceService: SourceService,
              private monthService: MonthService,
              private eraService: EraService,
              private authorService: AuthorService) {

    this.sources = [];
    this.initializeNewSource();

    this.isCreateSourceMode = false;
    this.isEditSourceMode = false;
    this.isAddAuthorMode = false;
    this.isAddNoteMode = false;

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

    this.authorService.getApiAuthors('/authors?sort=last_name').subscribe(authors => {
      console.log('Authors: ', authors);

      for (const author of authors.authors) {
        this.authors.push(author);
      }
    });

    this.getSources('/references?sort=title');
  }

  ngOnInit() { }

  initializeNewSource() {
    this.source = new Source();
    this.source.initializeSource();
  }

  initializeNewNote() {
    this.sourceNote = new SourceNote();
    this.sourceNote.initializeNote();
  }

  openSourceDetails(source, sideNav, isCreateMode, isEditMode) {
    this.source = source;

    if (!isCreateMode) {
      isCreateMode = false;
    }

    if (!isEditMode) {
      isEditMode = false;
    }

    this.isCreateSourceMode = isCreateMode;
    this.isEditSourceMode = isEditMode;

    this.publishedEraLabel = this.source.publishedEra.label;

    if (this.source.publishedMonth) {
      this.publishedMonthLabel = this.source.publishedMonth.label;
    }

    this.isAddAuthorMode = false;

    if (sideNav.opened) {
      sideNav.close().then(() => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

  closeSourceDetails(sideNav) {
    sideNav.close();
  }

  getSources(path) {
    this.sourceService.getApiSources(path).subscribe(response => {
      for (const source of response.sources) {
        this.sourceService.setSource(source);
      }

      this.sources = this.sourceService.getSources();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  createSource(sideNav) {
    // set the era objects
    for (const era of this.eras) {
      if (this.publishedEraLabel === era.label) {
        this.source.publishedEra = era;
      }
    }

    for (const month of this.months) {
      if (this.publishedMonthLabel === month.label) {
        this.source.publishedMonth = month;
      }
    }

    return this.sourceService.createApiSource(this.source).subscribe(response => {
      this.source.id = response.data.id;

      this.sourceService.setSource(this.source);

      this.isCreateSourceMode = false;

      this.closeSourceDetails(sideNav);

      this.initializeNewSource();
    });
  }

  createAuthor() {
    for (const author of this.authors) {
      if (this.authorId === author.id) {
        this.author = author;
        break;
      }
    }

    return this.sourceService.createApiSourceAuthor(this.source, this.author).subscribe(response => {
      this.author.relationshipId = response.data.id;

      this.isAddAuthorMode = false;

      this.source.authors.push(this.author);
    });
  }

  createNote() {
    this.sourceService.createApiSourceNote(this.sourceNote, this.source).subscribe(result => {
      if (!this.source.notes) {
        this.source.notes = [];
      }

      this.sourceNote.id = result.data.id;
      this.source.notes.push(this.sourceNote);

      this.initializeNewNote();

      this.isAddNoteMode = false;
    });
  }

  editSource() {
    if (!this.source.publishedDay || !this.source.publishedDay.length) {
      this.source.publishedDay = 'null';
    }

    if (this.publishedMonthLabel === null) {
      this.source.publishedMonth = new Month();
      this.source.publishedMonth.label = '';
      this.source.publishedMonth.id = 'null';
    }

    if (this.publishedMonthLabel) {
      for (const month of this.months) {
        if (this.publishedMonthLabel === month.label) {
          this.source.publishedMonth = month;
        }
      }
    }

    for (const era of this.eras) {
      if (this.publishedEraLabel === era.label) {
        this.source.publishedEra = era;
      }
    }

    return this.sourceService.patchApiSource(this.source).subscribe(() => {
      this.isEditSourceMode = false;

      if (this.source.publishedDay === 'null') {
        this.source.publishedDay = null;
      }
    });
  }

  removeSource(sideNav) {
    this.sourceService.removeApiSource(this.source).subscribe(() => {
      this.sourceService.removeSource(this.source);

      this.initializeNewSource();

      this.closeSourceDetails(sideNav);
    });
  }

  removeAuthor(author) {
    this.sourceService.removeApiSourceAuthor(author).subscribe(() => {
      this.sourceService.removeAuthor(this.source, author);
    });
  }

  removeNote(note) {
    this.sourceService.removeApiNote(note).subscribe(() => {
      console.log('Source: ', this.source);
      this.sourceService.removeNote(this.source, note);
    });
  }

  async activateCreateMode(sideNav) {
    this.isCreateSourceMode = true;
    this.initializeNewSource();

    this.openSourceDetails(this.source, sideNav, true);

    await this.sleep(500);

    document.getElementById('reference_title').focus();
  }

  async activateEventNoteForm() {
    this.isAddNoteMode = true;
    this.initializeNewNote();

    await this.sleep(500);

    document.getElementById('reference_note').focus();
  }

  cancelEditCreateModes(sideNav) {
    if (this.isCreateSourceMode) {
      this.closeSourceDetails(sideNav);
    }

    this.isCreateSourceMode = false;
    this.isEditSourceMode = false;
    this.isAddAuthorMode = false;
  }

  cancelSourceNoteForm() {
    this.isAddNoteMode = false;
    this.initializeNewNote();
  }

  cancelAddAuthorMode() {
    this.isAddAuthorMode = false;
  }

  turnPage(source) {
    if (source.pageIndex < source.previousPageIndex) {
      this.getSources(this.previousPage);
    } else if (source.pageIndex > source.previousPageIndex) {
      this.getSources(this.nextPage);
    }
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
