import {Component, Input, OnInit} from '@angular/core';
import {Timeline} from '../../models/timelines/timeline';
import {Category} from '../../models/category';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input() public category;
  @Input() public persons;
  @Input() public timeline: Timeline;
  @Input() public categoryEvents: Array<Category>;

  constructor() {}

  ngOnInit() {
    if (this.persons) {
      this.persons.sort((a, b) => {
        return a.birthYear - b.birthYear;
      });
    }
  }

}
