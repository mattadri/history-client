import {Component, OnInit} from '@angular/core';

import {Essay} from '../models/essay';

import {EssayService} from '../services/essay.service';

@Component({
  selector: 'app-essays',
  templateUrl: './essays.component.html',
  styleUrls: ['./essays.component.scss']
})

export class EssaysComponent implements OnInit {
  public essays: Essay[];
  public essay: Essay;

  public isCreateEssayMode: boolean;
  public isCreateTimelineMode: boolean;

  public totalResults: number;
  public nextPage: string;
  public previousPage: string;

  constructor(private essayService: EssayService) {
    this.isCreateEssayMode = false;

    this.getEssays('/essays?order_by=descending&page%5Bnumber%5D=1&fields[essay]=title,abstract');
  }

  static closeEssayDetails(contentPanel) {
    contentPanel.close();
  }

  ngOnInit() { }

  initializeNewEssay() {
    this.essay = new Essay();
    this.essay.initializeNewEssay();
  }

  getEssays(path) {
    this.essayService.getApiEssays(path).subscribe(response => {
      for (const essay of response.essays) {
        this.essayService.setEssay(essay);
      }

      this.essays = this.essayService.getEssays();

      this.totalResults = response.total;
      this.nextPage = response.links.next;
      this.previousPage = response.links.prev;
    });
  }

  createEssay(contentPanel) {
    return this.essayService.createApiEssay(this.essay).subscribe(response => {
      this.essay.id = response.data.id;

      this.essayService.setEssay(this.essay);

      this.isCreateEssayMode = false;

      EssaysComponent.closeEssayDetails(contentPanel);

      this.initializeNewEssay();
    });
  }

  activateCreateMode(contentPanel) {
    this.isCreateEssayMode = true;

    this.initializeNewEssay();

    this.openCreateDialog(this.essay, contentPanel, true);
  }

  openCreateDialog(essay, contentPanel, isCreateMode) {
    this.essay = essay;

    if (!isCreateMode) {
      isCreateMode = false;
    }

    this.isCreateTimelineMode = isCreateMode;

    if (contentPanel.opened) {
      contentPanel.close().then(() => {
        contentPanel.open();
      });
    } else {
      contentPanel.open();
    }
  }

  cancelCreateMode(contentPanel) {
    if (this.isCreateEssayMode) {
      EssaysComponent.closeEssayDetails(contentPanel);
    }

    this.isCreateEssayMode = false;
  }

  turnPage(essay) {
    if (essay.pageIndex < essay.previousPageIndex) {
      this.getEssays(this.previousPage);

    } else if (essay.pageIndex > essay.previousPageIndex) {
      this.getEssays(this.nextPage);
    }
  }
}
