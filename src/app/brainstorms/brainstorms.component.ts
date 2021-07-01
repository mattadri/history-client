import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import {Brainstorm} from '../models/brainstorm';

import {BrainstormService} from '../services/brainstorm.service';
import {AddBrainstormDialogComponent} from '../utilities/add-brainstorm-dialog/add-brainstorm-dialog.component';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-brainstorms',
  templateUrl: './brainstorms.component.html',
  styleUrls: ['./brainstorms.component.scss']
})
export class BrainstormsComponent implements OnInit {
  public brainstorms: Brainstorm[];
  public brainstorm: Brainstorm;

  public userBrainstorms: Brainstorm[];
  public allBrainstorms: Brainstorm[];

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  private userId: string;

  public showAllToggleColor: ThemePalette;
  public showAllToggleChecked: boolean;

  constructor(private brainstormService: BrainstormService, public dialog: MatDialog) {
    this.showAllToggleChecked = false;
    this.showAllToggleColor = 'primary';

    this.userId = localStorage.getItem('user.id');

    this.brainstorms = [];
    this.userBrainstorms = [];
    this.allBrainstorms = [];

    this.getUserBrainstorms(null, false);
  }

  ngOnInit() {
  }

  getUserBrainstorms(path: string, isAnotherPage: boolean) {
    if (!this.userBrainstorms.length || isAnotherPage) {
      this.brainstormService.getApiBrainstorms(path, this.userId, null, '1', null, ['title', 'description'], null, null, null, isAnotherPage).subscribe(response => {
        this.brainstorms = response.brainstorms;
        this.userBrainstorms = response.brainstorms;

        this.totalResults = response.total;
        this.nextPage = response.links.next;
        this.previousPage = response.links.prev;
      });

    } else {
      this.brainstorms = this.userBrainstorms;
    }
  }

  getAllBrainstorms(path: string, isAnotherPage: boolean) {
    if (!this.allBrainstorms.length || isAnotherPage) {
      this.brainstormService.getApiBrainstorms(path, null, null, '1', null, ['title', 'description'], null, null, null, isAnotherPage).subscribe(response => {
        this.brainstorms = response.brainstorms;
        this.allBrainstorms = response.brainstorms;

        this.totalResults = response.total;
        this.nextPage = response.links.next;
        this.previousPage = response.links.prev;
      });

    } else {
      this.brainstorms = this.allBrainstorms;
    }
  }

  toggleBrainstorms() {
    if (this.showAllToggleChecked) {
      this.getAllBrainstorms(null, false);
    } else {
      this.getUserBrainstorms(null, false);
    }
  }

  createBrainstorm() {
    const dialogRef = this.dialog.open(AddBrainstormDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(brainstorm => {
      if (brainstorm) {
        this.brainstormService.createApiBrainstorm(brainstorm).subscribe(response => {
          brainstorm.id = response.data.id;

          this.brainstormService.setBrainstorm(brainstorm);

          this.brainstorms.unshift(brainstorm);

          this.brainstormService.addUserToBrainstorm(brainstorm, this.userId).subscribe(() => {});
        });
      }
    });
  }

  turnPage(brainstorm) {
    if (brainstorm.pageIndex < brainstorm.previousPageIndex) {
      if (this.showAllToggleChecked) {
        this.getAllBrainstorms(this.previousPage, true);
      } else {
        this.getUserBrainstorms(this.previousPage, true);
      }
    } else if (brainstorm.pageIndex > brainstorm.previousPageIndex) {
      if (this.showAllToggleChecked) {
        this.getAllBrainstorms(this.nextPage, true);
      } else {
        this.getUserBrainstorms(this.nextPage, true);
      }
    }
  }
}
