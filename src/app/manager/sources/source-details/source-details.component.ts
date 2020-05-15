import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SourceService} from '../../../services/source.service';

import {Source} from '../../../models/source';
import {SourceNote} from '../../../models/source-note';

@Component({
  selector: 'app-source-details',
  templateUrl: './source-details.component.html',
  styleUrls: ['./source-details.component.scss']
})
export class SourceDetailsComponent implements OnInit {
  public source: Source;
  public note: SourceNote;

  public displayAuthors: string;

  public isAddNoteMode: boolean;

  constructor(private route: ActivatedRoute,
              private sourceService: SourceService) {
    const sourceId = this.route.snapshot.paramMap.get('id');

    this.isAddNoteMode = false;

    this.sourceService.getApiSource(Number.parseInt(sourceId, 0)).subscribe(source => {
      this.source = source;

      this.sourceService.setSource(this.source);

      this.makeAuthorsDisplay();
    });
  }

  ngOnInit() {
  }

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

  activateAddNoteMode() {
    this.isAddNoteMode = true;

    this.initializeNewNote();
  }

  deactivateAddNoteMode() {
    this.isAddNoteMode = false;
  }

  saveNote() {
    this.sourceService.createApiSourceNote(this.note, this.source).subscribe(response => {
      if (!this.source.notes) {
        this.source.notes = [];
      }

      this.note.id = response.data.id;
      this.source.notes.push(this.note);

      this.initializeNewNote();

      this.isAddNoteMode = false;
    });
  }

  deleteNote(note: SourceNote) {
    this.sourceService.removeApiNote(note).subscribe(() => {
      SourceService.removeNote(this.source, note);
    });
  }
}
