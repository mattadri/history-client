import { Component, OnInit } from '@angular/core';
import {Brainstorm} from '../models/brainstorm';
import {BrainstormService} from '../services/brainstorm.service';

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

  constructor(private brainstormService: BrainstormService) {
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

  turnPage(brainstorm) {
    if (brainstorm.pageIndex < brainstorm.previousPageIndex) {
      this.getBrainstorms(this.previousPage);
    } else if (brainstorm.pageIndex > brainstorm.previousPageIndex) {
      this.getBrainstorms(this.nextPage);
    }
  }
}
