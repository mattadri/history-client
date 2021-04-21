import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {SourceService} from '../../../services/source.service';

import {Source} from '../../../models/source';
import {Sleep} from '../../../utilities/sleep';

@Component({
  selector: 'app-quick-source',
  templateUrl: './quick-source.component.html',
  styleUrls: ['./quick-source.component.scss']
})
export class QuickSourceComponent implements OnInit, AfterViewInit {
  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  public searchEvents: Event[] = [];

  public sources: Source[] = [];

  public source: Source;

  constructor(private sourceService: SourceService,
              public dialogRef: MatDialogRef<QuickSourceComponent>) {

    this.source = new Source();
    this.source.initializeSource();

    this.sourceService.getApiSources('/references?page[size]=0&fields[reference]=title,sub_title&sort=title').subscribe(sources => {
      for (const source of sources.sources) {
        this.sourceService.setSource(source);
      }

      this.sources = this.sourceService.getSources();

      this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(source => this._filterSources(source))
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

  saveSource() {
    console.log('noop');
  }

  saveSourceTitle(value) {
    if (value) {
      this.source.title = value;
    } else {
      this.source.title = this.sourcesAutocompleteControl.value;
    }
  }

  displaySource(source: Source) {
    if (source) {
      this.sourceFieldDisplayValue = source.title;

      if (source.subTitle) {
        this.sourceFieldDisplayValue = this.sourceFieldDisplayValue + ': ' + source.subTitle;
      }
    }

    return this.sourceFieldDisplayValue;
  }

  private _filterSources(filterValue: any): Source[] {
    // when a source is actually selected the value is changed to the source itself. Do not filter if that is the case.
    if (!filterValue.id) {
      filterValue = filterValue.toLowerCase();

      return this.sources.filter(source => {
        return source.title.toLowerCase().includes(filterValue);
      });
    }
  }

  async activateCreateForm() {
    await Sleep.wait(500);

    document.getElementById('source_title').focus();
  }
}
