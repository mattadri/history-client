import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {Source} from '../../../models/source';

import {SourceService} from '../../../services/source.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editor-select-source',
  templateUrl: './editor-select-source.component.html',
  styleUrls: ['./editor-select-source.component.scss']
})
export class EditorSelectSourceComponent implements OnInit {
  public sources: Source[];

  public responseObject: any;

  public loadAutoComplete: boolean;

  public sourcesAutocompleteControl = new FormControl();
  public sourcesFilteredOptions: Observable<Source[]>;
  public sourceFieldDisplayValue: string;

  constructor(public dialogRef: MatDialogRef<EditorSelectSourceComponent>,
              private sourceService: SourceService) {
    this.responseObject = {
      source: null,
      chapter: '',
      startPage: 0,
      endPage: 0
    };

    this.responseObject.chapter = localStorage.getItem('last_chapter') || '';

    this.loadAutoComplete = false;

    this.sourceService.getApiSources(null, '0', null, null, ['title', 'sub_title'], null, false, null, false).subscribe(sources => {
      for (const source of sources.sources) {
        this.sourceService.setSource(source);
      }

      this.sources = this.sourceService.getSources();

      this.sourcesFilteredOptions = this.sourcesAutocompleteControl.valueChanges.pipe(
        startWith(''),
        map(source => this._filterSources(source))
      );

      this.loadAutoComplete = true;
    });
  }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveSource() {
    this.responseObject.source = this.sourcesAutocompleteControl.value;
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
    if (filterValue && typeof filterValue === 'string') {
      filterValue = filterValue.toLowerCase();

      return this.sources.filter(source => {
        return source.title.toLowerCase().includes(filterValue);
      });
    }
  }
}
