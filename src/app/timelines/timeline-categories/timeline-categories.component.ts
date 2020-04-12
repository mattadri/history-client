import {Component, Input, OnInit} from '@angular/core';

import {TimelineCategory} from '../../models/timeline-category';
import {TimelineService} from '../../services/timeline.service';
import {Timeline} from '../../models/timeline';

@Component({
  selector: 'app-timeline-categories',
  templateUrl: './timeline-categories.component.html',
  styleUrls: ['./timeline-categories.component.scss']
})
export class TimelineCategoriesComponent implements OnInit {
  @Input() public timeline: Timeline;
  @Input() public categoryEvents: Array;

  public isCreateMode: boolean;

  public newCategory: TimelineCategory;

  constructor(private timelineService: TimelineService) {}

  ngOnInit() {
    this.isCreateMode = false;

    this.initializeNewCategory();

    console.log('Event Categories: ', this.categoryEvents);
  }

  initializeNewCategory() {
    this.newCategory = new TimelineCategory();
    this.newCategory.id = null;
    this.newCategory.label = '';
    this.newCategory.events = [];
    this.newCategory.people = [];
  }

  activateCreateMode() {
    this.isCreateMode = true;
  }

  cancelCreateMode() {
    this.isCreateMode = false;
  }

  createNewCategory() {
    this.timelineService.createCategoryApiTimeline(this.newCategory, this.timeline).subscribe(response => {
      this.cancelCreateMode();

      this.newCategory.id = response.data.id;
      this.timeline.categories.push(this.newCategory);

      this.initializeNewCategory();
    });
  }

  removeCategory(category) {
    this.timelineService.removeCategoryApiTimeline(category.id).subscribe(response => {
      for (let i = 0; i < this.timeline.categories.length; i++) {
        if (this.timeline.categories[i].id === category.id) {
          this.timeline.categories.splice(i, 1);
        }
      }

      let genericCategory = null;

      for (const usedCategory of this.categoryEvents) {
        if (usedCategory.id === null) {
          genericCategory = usedCategory;
          break;
        }
      }

      for (let i = 0; i < this.categoryEvents.length; i++) {
        if (this.categoryEvents[i].id && this.categoryEvents[i].id === category.id) {
          for (const singlePointEvent of this.categoryEvents[i].singlePointEvents) {
            genericCategory.singlePointEvents.push(singlePointEvent);
          }

          for (const multiPointEvent of this.categoryEvents[i].multiPointEvents) {
            genericCategory.multiPointEvents.push(multiPointEvent);
          }

          this.categoryEvents.splice(i, 1);

          break;
        }
      }
    });
  }

  updateCategory() {

  }
}
