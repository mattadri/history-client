import { Component, OnInit } from '@angular/core';

import { ReferenceService } from '../../services/reference.service';
import { MonthService } from '../../services/month.service';
import { EraService } from '../../services/era.service';
import { AuthorService } from '../../services/author.service';

import { Reference } from '../../models/reference';
import { Month } from '../../models/month';
import { Era } from '../../models/era';
import { Author } from '../../models/author';

@Component({
  selector: 'app-references',
  templateUrl: './references.component.html',
  styleUrls: ['./references.component.scss']
})

export class ReferencesComponent implements OnInit {
  public references: Reference[];
  public reference: Reference;

  public eras: Era[] = [];
  public months: Month[] = [];
  public references: Reference[] = [];
  public authors: Author[] = [];
  public author: Author;

  public isCreateReferenceMode: boolean;
  public isEditReferenceMode: boolean;
  public isAddAuthorMode: boolean;

  public publishedMonthLabel: string;
  public publishedEraLabel: string;
  public authorId: number;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private referenceService: ReferenceService,
              private monthService: MonthService,
              private eraService: EraService,
              private authorService: AuthorService) {

    this.references = [];
    this.initializeNewReference();

    this.isCreateReferenceMode = false;
    this.isEditReferenceMode = false;
    this.isAddAuthorMode = false;

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

    this.getReferences('/references?sort=title');
  }

  ngOnInit() { }

  initializeNewReference() {
    this.reference = new Reference();
    this.reference.initializeReference();
  }

  getReferences(path) {
    this.referenceService.getApiReferences(path).subscribe(response => {
      for (const reference of response.references) {
        this.referenceService.setReference(reference);
      }

      this.references = this.referenceService.getReferences();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  createReference(sideNav) {
    // set the era objects
    for (const era of this.eras) {
      if (this.publishedEraLabel === era.label) {
        this.reference.publishedEra = era;
      }
    }

    for (const month of this.months) {
      if (this.publishedMonthLabel === month.label) {
        this.reference.publishedMonth = month;
      }
    }

    return this.referenceService.createApiReference(this.reference).subscribe(response => {
      this.reference.id = response.data.id;

      this.referenceService.setReference(this.reference);

      this.isCreateReferenceMode = false;

      this.closeReferenceDetails(sideNav);

      this.initializeNewReference();
    });
  }

  addAuthor() {
    for (const author of this.authors) {
      if (this.authorId === author.id) {
        this.author = author;
        break;
      }
    }

    return this.referenceService.createApiReferenceAuthor(this.reference, this.author).subscribe(response => {
      this.author.relationshipId = response.data.id;

      this.isAddAuthorMode = false;

      this.reference.authors.push(this.author);
    });
  }

  removeAuthor(author) {
    this.referenceService.removeApiReferenceAuthor(author).subscribe(response => {
      this.referenceService.removeAuthor(this.reference, author);
    });
  }

  editReference() {
    if (!this.reference.publishedDay || !this.reference.publishedDay.length) {
      this.reference.publishedDay = 'null';
    }

    if (this.publishedMonthLabel === null) {
      this.reference.publishedMonth = new Month();
      this.reference.publishedMonth.label = '';
      this.reference.publishedMonth.id = 'null';
    }

    if (this.publishedMonthLabel) {
      for (const month of this.months) {
        if (this.publishedMonthLabel === month.label) {
          this.reference.publishedMonth = month;
        }
      }
    }

    for (const era of this.eras) {
      if (this.publishedEraLabel === era.label) {
        this.reference.publishedEra = era;
      }
    }

    return this.referenceService.patchApiReference(this.reference).subscribe(response => {
      this.isEditReferenceMode = false;

      if (this.reference.publishedDay === 'null') {
        this.reference.publishedDay = null;
      }
    });
  }

  removeReference(sideNav) {
    this.referenceService.removeApiReference(this.reference).subscribe(response => {
      this.referenceService.removeReference(this.reference);

      this.initializeNewReference();

      this.closeReferenceDetails(sideNav);
    });
  }

  openReferenceDetails(reference, sideNav, isCreateMode, isEditMode) {
    this.reference = reference;

    if (!isCreateMode) {
      isCreateMode = false;
    }

    if (!isEditMode) {
      isEditMode = false;
    }

    this.isCreateReferenceMode = isCreateMode;
    this.isEditReferenceMode = isEditMode;

    this.publishedEraLabel = this.reference.publishedEra.label;

    if (this.reference.publishedMonth) {
      this.publishedMonthLabel = this.reference.publishedMonth.label;
    }

    this.isAddAuthorMode = false;

    if (sideNav.opened) {
      sideNav.close().then(done => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
  }

  closeReferenceDetails(sideNav) {
    sideNav.close();
  }

  cancelAddAuthorMode() {
    this.isAddAuthorMode = false;
  }

  activateCreateMode(sideNav) {
    this.isCreateReferenceMode = true;
    this.initializeNewReference();

    this.openReferenceDetails(this.reference, sideNav, true);
  }

  cancelEditCreateModes(sideNav) {
    if (this.isCreateReferenceMode) {
      this.closeReferenceDetails(sideNav);
    }

    this.isCreateReferenceMode = false;
    this.isEditReferenceMode = false;
    this.isAddAuthorMode = false;
  }

  turnPage(reference) {
    if (reference.pageIndex < reference.previousPageIndex) {
      this.getReferences(this.previousPage);
    } else if (reference.pageIndex > reference.previousPageIndex) {
      this.getReferences(this.nextPage);
    }
  }
}
