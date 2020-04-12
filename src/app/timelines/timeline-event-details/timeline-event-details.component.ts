import { Component, Inject } from '@angular/core';

import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

import { Event } from '../../models/event';
import { Timeline } from '../../models/timeline';

import { TimelineService } from '../../services/timeline.service';
import {TimelineCategory} from '../../models/timeline-category';
import {Category} from '../../models/category';

export interface DialogData {
  event: Event;
  timeline: Timeline;
  categoryEvents: Array;
}

@Component({
  selector: 'app-timeline-event-details',
  templateUrl: './timeline-event-details.component.html',
  styleUrls: ['./timeline-event-details.component.scss']
})
export class TimelineEventDetailsComponent {
  public isShadow: boolean;
  public selectedCategoryId: number;
  public selectedCategory: TimelineCategory;
  public categoryEventId: number;

  public isInCategory: boolean;

  constructor(public dialogRef: MatBottomSheetRef<TimelineEventDetailsComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: DialogData,
              public timelineService: TimelineService) {

    const self = this;

    this.isShadow = data.event.isShadow;
    this.selectedCategoryId = 0;
    this.categoryEventId = 0;
    this.selectedCategory = null;
    this.isInCategory = false;

    // check if this event is in a category or not
    for (const category of this.data.timeline.categories) {
      if (!category.events) {
        category.events = [];
      }

      function idFound(ids) {
        return ids[1] === self.data.event.id.toString();
      }

      const categoryEventIndex = category.events.findIndex(idFound);

      if (categoryEventIndex >= 0) {
        this.isInCategory = true;
        this.selectedCategory = category;
        this.selectedCategoryId = category.id;
        this.categoryEventId = category.events[categoryEventIndex][0];
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateShadowState(checkbox) {
    // this is a change event, but does not have access to the event at the moment of the click event.
    // As such false is equal to true and the other way around
    let shadowState = false;

    if (!this.isShadow) {
      shadowState = true;
    }

    this.data.event.isShadow = shadowState;

    this.timelineService.patchEventApiTimeline(this.data.timeline, this.data.event).subscribe(response => {
      console.log(response);
    });
  }

  addToCategory() {
    let categoryToAdd: TimelineCategory = new TimelineCategory();

    for (const category of this.data.timeline.categories) {
      if (category.id === this.selectedCategoryId) {
        categoryToAdd = category;
      }
    }

    // event was not in a category and is being added to one
    if (!this.selectedCategory) {
      this.timelineService.createCategoryEventApiTimeline(categoryToAdd, this.data.event).subscribe(response => {
        this.categoryEventId = response.data.id;
        this.selectedCategory = categoryToAdd;
        this.selectedCategoryId = categoryToAdd.id;
        this.isInCategory = true;

        this.addCategoryEventToTimeline(this.data.event, this.categoryEventId);
      });

    } else {
      // event was in a category and is now being removed from all categories
      if (this.selectedCategoryId == 0) {
        this.timelineService.removeCategoryEventApiTimeline(this.categoryEventId).subscribe(response => {
          this.removeCategoryEventFromTimeline(this.data.event, this.categoryEventId, this.selectedCategory.id, false);

          this.selectedCategoryId = 0;
          this.categoryEventId = 0;
          this.selectedCategory = null;
          this.isInCategory = false;
        });

        // event is was in category A and is being updated to category B
      } else {
        this.timelineService.removeCategoryEventApiTimeline(this.categoryEventId).subscribe(response => {
          this.removeCategoryEventFromTimeline(this.data.event, this.categoryEventId, this.selectedCategoryId, true);

          this.timelineService.createCategoryEventApiTimeline(categoryToAdd, this.data.event).subscribe(secondResponse => {
            this.categoryEventId = secondResponse.data.id;
            this.selectedCategory = categoryToAdd;
            this.selectedCategoryId = categoryToAdd.id;
            this.isInCategory = true;

            this.addCategoryEventToTimeline(this.data.event, this.categoryEventId);
          });
        });
      }
    }
  }

  addCategoryEventToTimeline(event, categoryEventId) {
    // add it to the list of available categories
    this.selectedCategory.events.push([categoryEventId, event.id]);

    // if this is the first event in the category add the category to the data object first
    let thisCategory = null;

    for (const category of this.data.categoryEvents) {
      if (category.id === this.selectedCategoryId) {
        thisCategory = category;
      }
    }

    if (!thisCategory) {
      thisCategory = new Category();
      thisCategory.id = this.selectedCategory.id;
      thisCategory.label = this.selectedCategory.label;
      thisCategory.events = [];
      thisCategory.people = [];

      this.data.categoryEvents.push(thisCategory);
    }

    // add the event to the categoryEvents object so it reflects on the timeline
    for (const category of this.data.categoryEvents) {
      // remove event from the generic category if it's there
      if (!category.id) {
        if (event.formattedStartYear === event.formattedEndYear) {
          for (let i = 0; i < category.singlePointEvents.length; i++) {
            if (category.singlePointEvents[i].id === event.id) {
              category.singlePointEvents.splice(i, 1);
            }
          }
        } else {
          for (let i = 0; i < category.multiPointEvents.length; i++) {
            if (category.multiPointEvents[i].id === event.id) {
              category.multiPointEvents.splice(i, 1);
            }
          }
        }
      }

      // add the event to the appropriate category
      if (category.id === this.selectedCategoryId) {
        if (event.formattedStartYear === event.formattedEndYear) {
          category.singlePointEvents.push(event);
        } else {
          category.multiPointEvents.push(event);
        }
      }
    }
  }

  removeCategoryEventFromTimeline(event, categoryEventId, selectedCategoryId, isUpdate) {
    // remove it from the list of available categories
    for (const category of this.data.timeline.categories) {
      if (category.events.length) {
        for (let i = 0; i < category.events.length; i++) {
          if (category.events[i][1] === event.id && category.events[i][0] === categoryEventId) {
            category.events.splice(i, 1);
          }
        }
      }
    }

    // remove the event from the category events so that it is reflected on the timeline
    for (const category of this.data.categoryEvents) {
      // if actually removing from all categories and not just updating it to a new category then add it back to the generic category
      if (!isUpdate) {
        if (!category.id) {
          if (event.formattedEndYear === event.formattedStartYear) {
            category.singlePointEvents.push(event);
          } else {
            category.multiPointEvents.push(event);
          }
        }
      }

      if (category.id === this.selectedCategory.id) {
        if (event.formattedEndYear === event.formattedStartYear) {
          for (let i = 0; i < category.singlePointEvents.length; i++) {
            if (category.singlePointEvents[i].id === event.id) {
              category.singlePointEvents.splice(i, 1);
            }
          }
        } else {
          for (let i = 0; i < category.multiPointEvents.length; i++) {
            if (category.multiPointEvents[i].id === event.id) {
              category.multiPointEvents.splice(i, 1);
            }
          }
        }

        // if there are no more events in this category remove it from the main categoryEvents object
        if (!category.singlePointEvents.length && !category.multiPointEvents.length) {
          for (let i = 0; i < this.data.categoryEvents.length; i++) {
            if (category.id === this.data.categoryEvents[i].id) {
              this.data.categoryEvents.splice(i, 1);
            }
          }
        }
      }
    }
  }
}
