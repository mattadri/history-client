import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { SourceService } from '../../services/source.service';
import { EraService } from '../../services/era.service';

import { Source } from '../../models/source';
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

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

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

    this.getSources(null, ['created'], true, false);
  }

  ngOnInit() { }

  initializeNewSource() {
    this.source = new Source();
    this.source.initializeSource();
  }

  getSources(path: string, sort: Array<string>, sortDescending: boolean, isAnotherPage: boolean) {
    this.sourceService.getApiSources(path, null, null, null, ['title', 'sub_title'], sort, sortDescending, null, isAnotherPage).subscribe(response => {
      this.sources = response.sources;

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

  removeSource(source) {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the source ',
        content: '<li>' + source.notes.length.toString() + ' notes will be removed.</li>'
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.sourceService.removeApiSource(source).subscribe(() => {
          this.sourceService.removeSource(source);

          this.initializeNewSource();
        });
      }
    });
  }

  closeSourceDetails(sideNav) {
    sideNav.close();
  }

  turnPage(source) {
    if (source.pageIndex < source.previousPageIndex) {
      this.getSources(this.previousPage, null, false, true);
    } else if (source.pageIndex > source.previousPageIndex) {
      this.getSources(this.nextPage, null, false, true);
    }
  }
}
