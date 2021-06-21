import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { Options } from 'ng5-slider';

import FroalaEditor from 'froala-editor/js/froala_editor.min.js';

import { TimelineService } from '../../services/timeline.service';

import { Timeline } from '../../models/timelines/timeline';
import { Event } from '../../models/events/event';
import {Category} from '../../models/category';

import {EventService} from '../../services/event.service';

import {QuickEventComponent} from '../../manager/events/quick-event/quick-event.component';
import {TimelineEvent} from '../../models/timelines/timeline-event';
import {User} from '../../models/user';
import {MessageDialogComponent} from '../../utilities/message-dialog/message-dialog.component';
import {AddUserDialogComponent} from '../../utilities/add-user-dialog/add-user-dialog.component';
import {UserService} from '../../services/user.service';
import {TimelineDisplayComponent} from './timeline-display/timeline-display.component';
import {ConfirmRemovalComponent} from '../../utilities/confirm-removal/confirm-removal.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {
  @ViewChild(TimelineDisplayComponent) timelineDisplayComponent: TimelineDisplayComponent;

  public timeline: Timeline;

  public timelineUsers: User[];

  public isTimelineEditMode: boolean;
  public isAddDescriptionMode: boolean;

  public cursorLineActive: boolean;
  public cursorLineStyles: object;
  public cursorLineDate: string;
  public cursorLineDatePosition: string;

  public timelineStart: number;
  public timelineEnd: number;
  public timelineSpanInYears: number;
  public timeframe: any[];
  public options: Options;

  public categoryEvents: Category[];

  public singlePointEvents = [];
  public multiPointEvents = [];

  public relatedEvents: Event[];
  public relatedEventsTotalResults: number;
  public relatedEventsPreviousPage: string;
  public relatedEventsNextPage: string;

  public timelineEditor: FroalaEditor;
  public initControls;

  public persons = [];

  public showReturnHeader: boolean;
  public returnPath: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private timelineService: TimelineService,
              private eventService: EventService,
              private userService: UserService,
              public dialog: MatDialog) {

    this.isTimelineEditMode = false;
    this.isAddDescriptionMode = false;

    this.cursorLineActive = false;
    this.cursorLineDatePosition = 'above';

    this.timelineUsers = [];

    this.showReturnHeader = false;
    this.returnPath = '';

    this.timelineSpanInYears = 0;

    this._setReturnHeader();

    const timelineId = this.route.snapshot.paramMap.get('id');

    this.timelineService.getApiTimeline(timelineId).subscribe(timeline => {
      this.timeline = timeline;

      if (!this.timeline.categories) {
        this.timeline.categories = [];
      }

      this.timelineService.getApiTimelineUsers(null, this.timeline).subscribe((response) => {
        this.timelineUsers = response.users;
      });

      this.setPersons();
    });
  }

  // If the era is BC then make the number a negative
  private static convertPolarity(value: number, comparator: Event): number {
    if (comparator.startEra.label === 'BC') {
      value = value * -1;
    }

    return value;
  }

  ngOnInit() { }

  addUser() {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(user => {
      let userExists = false;

      for (const currentUser of this.timelineUsers) {
        if (user.id === currentUser.id) {
          userExists = true;
          break;
        }
      }

      if (userExists) {
        this.dialog.open(MessageDialogComponent, {
          width: '250px',
          data: {
            title: 'Could Not Add User',
            message: 'User is already part of the timeline.'
          }
        });
      } else {
        this.timelineService.addUserToTimeline(this.timeline, user.id).subscribe(() => {
          this.timelineUsers.push(user);
        });
      }
    });
  }

  public initializeTimelineDescriptionEditor(initControls) {
    this.initControls = initControls;
    this.initControls.initialize();
    this.timelineEditor = this.initControls.getEditor();

    this.timelineEditor.opts.width = 1000;
  }

  setTimelineSpan(span) {
    this.timelineSpanInYears = span;
  }

  setCategoryEvents(categoryEvents) {
    this.categoryEvents = categoryEvents;
  }

  setPersons() {
    if (this.timeline.persons && this.timeline.persons.length) {
      for (const person of this.timeline.persons) {
        this.persons.push(person);
      }
    }
  }

  filterEvents() {
    this.timeline.events = this.timeline.events.filter(timelineEvent => {
      if (TimelineComponent.convertPolarity(timelineEvent.event.startYear, timelineEvent.event) < this.timelineStart) {
        return false;
      } else if (TimelineComponent.convertPolarity(timelineEvent.event.endYear, timelineEvent.event) > this.timelineEnd) {
        return false;
      }

      return true;
    });
  }

  setRelatedEvents(startEndYears: Array<number>) {
    this.timelineStart = startEndYears[0];
    this.timelineEnd = startEndYears[1];

    // If a new timeline it won't have a start or end value. If so skip related events lookup.
    if (this.timelineStart && this.timelineEnd) {
      this.getRelatedEvents(null, false);
    }
  }

  getRelatedEvents(path, isPageLink) {
    let timelineStartEra = 'AD';
    let timelineEndEra = 'AD';

    if (this.timelineStart < 0) {
      timelineStartEra = 'BC';
    }

    if (this.timelineEnd < 0) {
      timelineEndEra = 'BC';
    }

    this.eventService.getApiEvents(path, null, [[this.timelineStart, timelineStartEra], [this.timelineEnd, timelineEndEra]], isPageLink).subscribe(response => {
      this.relatedEvents = response.events;

      this.relatedEventsTotalResults = response.total;
      this.relatedEventsPreviousPage = response.links.previous;
      this.relatedEventsNextPage = response.links.next;

      if (this.timeline.events && this.timeline.events.length) {
        this.relatedEvents = this.relatedEvents.filter((el) => {
          if (!this.timeline.events.find((ev) => ev.event.id === el.id)) {
            return el;
          }
        });
      }
    });
  }

  activateTimelineEditMode() {
    this.cursorLineActive = false;
    this.isTimelineEditMode = true;
  }

  closeTimelineEditorMode() {
    this.isTimelineEditMode = false;
  }

  saveDescription(content) {
    this.timeline.description = content;

    this.editTimeline();

    this.isAddDescriptionMode = false;
  }

  editTimeline() {
    this.timelineService.patchApiTimeline(this.timeline).subscribe(() => {
      this.isTimelineEditMode = false;
    });
  }

  removeTimeline() {
    const dialogRef = this.dialog.open(ConfirmRemovalComponent, {
      width: '250px',
      data: {
        label: 'the timeline ',
        content: ''
      }
    });

    dialogRef.afterClosed().subscribe(doClose => {
      if (doClose) {
        this.timelineService.removeApiTimeline(this.timeline).subscribe(() => {
          this.timelineService.removeTimeline(this.timeline);

          this.router.navigate(['/timelines']).then();
        });
      }
    });
  }

  createEvent() {
    const dialogRef = this.dialog.open(QuickEventComponent, {
      width: '750px',
      data: {
        showExisting: true,
        showNew: true
      }
    });

    dialogRef.afterClosed().subscribe(eventObj => {
      let event = eventObj.event;
      const isExisting = eventObj.isExisting;

      // IF ADDING AN EXISTING EVENT TO THE TIMELINE
      if (isExisting) {
        // get the full description
        this.eventService.getApiEvent(event.id).subscribe((fullEvent) => {
          const timelineEvent = new TimelineEvent();
          timelineEvent.initializeNewTimelineEvent();

          timelineEvent.event = fullEvent;

          this.timelineService.createEventApiTimeline(timelineEvent, this.timeline).subscribe(timelineEventResponse => {
            timelineEvent.id = timelineEventResponse.data.id;

            this.timeline.events.push(timelineEvent);

            for (const categoryEvent of this.categoryEvents) {
              if (categoryEvent.id === null) {
                if (fullEvent.formattedStartYear === fullEvent.formattedEndYear) {
                  categoryEvent.singlePointEvents.push(fullEvent);
                } else {
                  categoryEvent.multiPointEvents.push(fullEvent);
                }

                break;
              }
            }

            this.timelineDisplayComponent.setTimelineStartAndEnd();
            this.timelineDisplayComponent.setTimeframe();
            this.timelineDisplayComponent.setTimelineEventLocations();
            this.timelineDisplayComponent.setTimelinePersonLocations();
          });
        });

      } else { // IF ADDING A NEW EVENT TO THE TIMELINE
        // THE USER CAN CLOSE DIALOG WITHOUT ENTERING INFO. CHECK TO MAKE SURE REQUIRED FIELDS ARE PRESENT.
        if (event.label) {
          this.eventService.createApiEvent(event).subscribe(newEventResponse => {
            event.id = newEventResponse.data.id;

            event.formatYears();
            event.formatDates();

            const timelineEvent = new TimelineEvent();
            timelineEvent.initializeNewTimelineEvent();

            timelineEvent.event = event;

            this.timelineService.createEventApiTimeline(timelineEvent, this.timeline).subscribe(timelineEventResponse => {
              timelineEvent.id = timelineEventResponse.data.id;

              this.timeline.events.push(timelineEvent);

              for (const categoryEvent of this.categoryEvents) {
                if (categoryEvent.id === null) {
                  if (event.formattedStartYear === event.formattedEndYear) {
                    categoryEvent.singlePointEvents.push(event);
                  } else {
                    categoryEvent.multiPointEvents.push(event);
                  }

                  break;
                }
              }

              this.timelineDisplayComponent.setTimelineStartAndEnd();
              this.timelineDisplayComponent.setTimeframe();
              this.timelineDisplayComponent.setTimelineEventLocations();
              this.timelineDisplayComponent.setTimelinePersonLocations();
            });
          });
        }
      }
    });
  }

  turnRelatedEventsPage(events) {
    if (events.pageIndex < events.previousPageIndex) {
      this.getRelatedEvents(this.relatedEventsPreviousPage, true);
    } else if (events.pageIndex > events.previousPageIndex) {
      this.getRelatedEvents(this.relatedEventsNextPage, true);
    }
  }

  async showCursorTooltip(tooltip) {
    await this.sleep(100);

    tooltip.show();
  }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private _setReturnHeader() {
    const previousPage = this.userService.getPreviousPage();

    if (previousPage.length && previousPage.includes('/projects/')) {
      this.returnPath = previousPage;
      this.showReturnHeader = true;
    }
  }
}
