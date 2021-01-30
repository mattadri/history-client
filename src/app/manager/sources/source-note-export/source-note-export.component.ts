import { Component, OnInit } from '@angular/core';
import {BrainstormService} from '../../../services/brainstorm.service';
import {Brainstorm} from '../../../models/brainstorm';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-source-note-export',
  templateUrl: './source-note-export.component.html',
  styleUrls: ['./source-note-export.component.scss']
})
export class SourceNoteExportComponent implements OnInit {
  public brainstorm: Brainstorm;
  public brainstorms: Brainstorm[];

  constructor(private brainstormService: BrainstormService, public dialogRef: MatDialogRef<SourceNoteExportComponent>) {
    this.brainstormService.getApiBrainstorms('/brainstorms?page[size]=0&fields[brainstorm]=title').subscribe((response) => {
      this.brainstorms = response.brainstorms;
    });
  }

  ngOnInit() {
  }

  onNoClick():void {
    this.dialogRef.close();
  }
}
