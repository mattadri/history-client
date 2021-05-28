import {Component, OnInit} from '@angular/core';

import {Essay} from '../models/essays/essay';

import {EssayService} from '../services/essay.service';
import {QuickEssayComponent} from './quick-essay/quick-essay.component';
import {MatDialog} from '@angular/material/dialog';
import {EssayUser} from '../models/essays/essay-user';
import {User} from '../models/user';
import {UserService} from '../services/user.service';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-essays',
  templateUrl: './essays.component.html',
  styleUrls: ['./essays.component.scss']
})

export class EssaysComponent implements OnInit {
  public essays: Essay[];
  public essay: Essay;

  private userEssays: Essay[];
  private allEssays: Essay[];

  public isCreateEssayMode: boolean;
  public isCreateTimelineMode: boolean;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  public loggedInUser: User;

  public showAllToggleColor: ThemePalette;
  public showAllToggleChecked: boolean;

  constructor(private essayService: EssayService, private userService: UserService, public dialog: MatDialog) {
    this.showAllToggleChecked = false;
    this.showAllToggleColor = 'primary';

    this.essays = [];
    this.allEssays = [];
    this.userEssays = [];

    this.loggedInUser = this.userService.getLoggedInUser();

    this.isCreateEssayMode = false;

    this.getUserEssays(null, false);
  }

  ngOnInit() { }

  initializeNewEssay() {
    this.essay = new Essay();
    this.essay.initializeNewEssay();
  }

  getAllEssays(path: string, isAnotherPage: boolean) {
    if (!this.allEssays.length || isAnotherPage) {
      this.essayService.getApiEssays(path, null, null, ['title', 'abstract', 'banner'], null, false, null, isAnotherPage).subscribe(response => {

        for (const essay of response.essays) {
          this.essayService.setEssay(essay);
        }

        this.essays = this.essayService.getEssays();
        this.allEssays = this.essayService.getEssays();

        this.totalResults = response.total;
        this.nextPage = response.links.next;
        this.previousPage = response.links.prev;
      });

    } else {
      this.essays = this.allEssays;
    }
  }

  getUserEssays(path: string, isAnotherPage: boolean) {
    if (!this.userEssays.length || isAnotherPage) {
      this.essayService.getApiEssays(path, this.loggedInUser.id, null, ['title', 'abstract', 'banner'], null, false, null, isAnotherPage).subscribe(response => {
        for (const essay of response.essays) {
          this.essayService.setEssay(essay);
        }

        this.essays = this.essayService.getEssays();
        this.userEssays = this.essayService.getEssays();

        this.totalResults = response.total;
        this.nextPage = response.links.next;
        this.previousPage = response.links.prev;
      });

    } else {
      this.essays = this.userEssays;
    }
  }

  toggleEssays() {
    if (this.showAllToggleChecked) {
      this.getAllEssays(null, false);
    } else {
      this.getUserEssays(null, false);
    }
  }

  createEssay() {
    const dialogRef = this.dialog.open(QuickEssayComponent, {
      width: '750px',
      data: {
        showExisting: false,
        showNew: true
      }
    });

    dialogRef.afterClosed().subscribe(returnObject => {
      if (returnObject) {
        let isExisting = returnObject.isExisting;
        let essay = returnObject.essay;

        if (!isExisting) {
          this.essayService.createApiEssay(essay).subscribe(response => {
            essay.id = response.data.id;

            let essayUser = new EssayUser();

            essayUser.essay = essay;
            essayUser.user = this.userService.getLoggedInUser();


            this.essayService.addApiUserToEssay(essayUser).subscribe((response) => {
              essayUser.id = response.id;

              essay.essayUsers.push(essayUser);
            });

            this.essays.unshift(essay);
          });
        }
      }
    });
  }

  turnPage(essay) {
    if (essay.pageIndex < essay.previousPageIndex) {
      if (this.showAllToggleChecked) {
        this.getAllEssays(this.previousPage, true);
      } else {
        this.getUserEssays(this.previousPage, true);
      }

    } else if (essay.pageIndex > essay.previousPageIndex) {
      if (this.showAllToggleChecked) {
        this.getAllEssays(this.nextPage, true);
      } else {
        this.getUserEssays(this.nextPage, true);
      }
    }
  }
}
