import { Component, OnInit } from '@angular/core';

import {MatDialog} from '@angular/material';

import { SourceService } from '../../services/source.service';
import { MonthService } from '../../services/month.service';
import { EraService } from '../../services/era.service';
import { AuthorService } from '../../services/author.service';

import { Source } from '../../models/source';
import { Month } from '../../models/month';
import { Era } from '../../models/era';
import { Author } from '../../models/author';
import { SourceNote } from '../../models/source-note';

import {ConfirmRemovalComponent} from '../../utilities/confirm-removal/confirm-removal.component';
import {QuickSourceComponent} from './quick-source/quick-source.component';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})

export class SourcesComponent implements OnInit {
  public sources: Source[] = [];
  public source: Source;

  public era: Era;

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

  public sourceLink: string;

  constructor(private sourceService: SourceService,
              private eraService: EraService,
              public dialog: MatDialog) {

    this.sources = [];
    this.initializeNewSource();

    this.isCreateSourceMode = false;

    this.eraService.getEras().subscribe(eras => {
      for (const era of eras.data) {
        if (era.attributes.label === 'AD') {
          this.era = era;
        }
      }
    });

    this.getSources('/references?sort=-created');
  }

  ngOnInit() { }

  initializeNewSource() {
    this.source = new Source();
    this.source.initializeSource();
  }

  openSourceDetails(source, sideNav) {
    this.source = source;

    if (this.source && this.source.id) {
      this.sourceLink = '/manager/sources/' + this.source.id.toString();
    }

    if (sideNav.opened) {
      sideNav.close().then(() => {
        sideNav.open();
      });
    } else {
      sideNav.open();
    }
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

  createSource() {
    const dialogRef = this.dialog.open(QuickSourceComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(source => {
      if (source) {
        source.publishedEra = this.era;

        this.sourceService.createApiSource(source).subscribe(response => {
          source.id = response.data.id;

          this.sourceService.setSource(source);

          this.sources.unshift(source);
        });
      }
    });
  }

  removeSource(sideNav) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the source ',
        content: '<li>' + this.source.notes.length.toString() + ' notes will be removed.</li>'
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.sourceService.removeApiSource(this.source).subscribe(() => {
          this.sourceService.removeSource(this.source);

          this.initializeNewSource();

          this.closeSourceDetails(sideNav);
        });
      }
    });
  }

  closeSourceDetails(sideNav) {
    sideNav.close();
  }

  turnPage(source) {
    if (source.pageIndex < source.previousPageIndex) {
      this.getSources(this.previousPage);
    } else if (source.pageIndex > source.previousPageIndex) {
      this.getSources(this.nextPage);
    }
  }
}
