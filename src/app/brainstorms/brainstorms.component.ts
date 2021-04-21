import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import {Brainstorm} from '../models/brainstorm';

import {BrainstormService} from '../services/brainstorm.service';
import {QuickBrainstormComponent} from './quick-brainstorm/quick-brainstorm.component';

@Component({
  selector: 'app-brainstorms',
  templateUrl: './brainstorms.component.html',
  styleUrls: ['./brainstorms.component.scss']
})
export class BrainstormsComponent implements OnInit {
  public brainstorms: Brainstorm[];
  public brainstorm: Brainstorm;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private brainstormService: BrainstormService, public dialog: MatDialog) {
    this.getBrainstorms('/brainstorms?page%5Bnumber%5D=1&fields[brainstorm]=title,description');
  }

  ngOnInit() {
  }

  getBrainstorms(path) {
    this.brainstormService.getApiBrainstorms(path).subscribe(response => {
      for (const brainstorm of response.brainstorms) {
        this.brainstormService.setBrainstorm(brainstorm);
      }

      this.brainstorms = this.brainstormService.getBrainstorms();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  createBrainstorm() {
    const dialogRef = this.dialog.open(QuickBrainstormComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(brainstorm => {
      if (brainstorm) {
        this.brainstormService.createApiBrainstorm(brainstorm).subscribe(response => {
          brainstorm.id = response.data.id;

          this.brainstormService.setBrainstorm(brainstorm);

          this.brainstorms.unshift(brainstorm);
        });
      }
    });
  }

  turnPage(brainstorm) {
    if (brainstorm.pageIndex < brainstorm.previousPageIndex) {
      this.getBrainstorms(this.previousPage);
    } else if (brainstorm.pageIndex > brainstorm.previousPageIndex) {
      this.getBrainstorms(this.nextPage);
    }
  }
}
