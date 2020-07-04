import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {MatDialog} from '@angular/material';

import { Options } from 'ng5-slider';

import FroalaEditor from 'froala-editor/js/froala_editor.min.js';

import { TimelineService } from '../../services/timeline.service';

import { Timeline } from '../../models/timeline';
import { Event } from '../../models/event';
import {Era} from '../../models/era';
import {Category} from '../../models/category';

import {EventService} from '../../services/event.service';

import {QuickEventComponent} from '../../manager/events/quick-event/quick-event.component';
import {TimelineEvent} from '../../models/timeline-event';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {
  public timeline: Timeline;

  public isTimelineEditMode: boolean;

  public cursorLineActive: boolean;
  public cursorLineStyles: object;
  public cursorLineDate: string;
  public cursorLineDatePosition: string;

  public timelineStart: number;
  public timelineEnd: number;
  public timelineSpanInYears: number;
  public timeframe: any[];
  public options: Options;

  public categoryEvents: Category[] = [];

  public singlePointEvents = [];
  public multiPointEvents = [];

  public relatedEvents: Event[];
  public relatedEventsTotalResults: number;
  public relatedEventsPreviousPage: string;
  public relatedEventsNextPage: string;

  public timelineEditor: FroalaEditor;
  public initControls;

  public persons = [];

  private timelineLength: number;

  private timelineEvents: Event[] = [];

  // declares the number of years in timeline length where if less than it will be measured in months instead of years
  private  minYearToMonths = 11;

  private eventColorClasses = [
    '#39ab28',
    '#23c28f',
    '#3b99ca',
    '#2b66c4',
    '#554db7',
    '#715ab7',
    '#a53ab7',
    '#b73560',
    '#c40c09',
    '#d5531e',
    '#d48e01',
    '#6fab05',
    '#028014',
    '#009673',
    '#0461a9',
    '#354cb0',
    '#5747b0',
    '#6f2da6',
    '#b74783',
    '#da392f',
    '#ee6e1f',
    '#c39c3b',
  ];

  constructor(private route: ActivatedRoute,
              private timelineService: TimelineService,
              private eventService: EventService,
              public dialog: MatDialog) {
    this.isTimelineEditMode = false;

    this.cursorLineActive = false;
    this.cursorLineDatePosition = 'above';

    const timelineId = this.route.snapshot.paramMap.get('id');

    this.timelineService.getApiTimeline(timelineId).subscribe(timeline => {
      this.timeline = timeline;

      if (!this.timeline.categories) {
        this.timeline.categories = [];
      }

      this.setTimelineStartAndEnd();
      this.setTimeframe();

      this.setTimelineEventLocations();
      this.setTimelinePersonLocations();

      this.mapEventsToCategories();

      this.setPersons();

      this.getRelatedEvents(null, false);

      console.log('Timeline: ', this.timeline);
      console.log('Category Events: ', this.categoryEvents);
    });
  }

  // If the era is BC then make the number a negative
  private static convertPolarity(value: number, comparator: Event): number {
    if (comparator.startEra.label === 'BC') {
      value = value * -1;
    }

    return value;
  }

  private static padTimelineDate(yearToPad: number, timelineLength: number, increase: boolean) {
    const minPadding = 1;
    const maxPadding = 100;

    // get 10 percent of the total length and see if it falls within the min/max range.
    let padding = timelineLength * .02;

    if (padding < minPadding) {
      padding = minPadding;
    }

    if (padding > maxPadding) {
      padding = maxPadding;
    }

    if (increase) {
      yearToPad = yearToPad + padding;
    } else {
      yearToPad = yearToPad - padding;
    }

    return yearToPad;
  }

  ngOnInit() { }

  public initializeTimelineDescriptionEditor(initControls) {
    this.initControls = initControls;
    this.initControls.initialize();
    this.timelineEditor = this.initControls.getEditor();

    this.timelineEditor.opts.width = 1000;
  }

  // this will get called if the timeline start/end points change
  calculateTimeline() {
    this.resetEvents();

    this.setTimelineStartAndEnd();
    this.setTimeframe();
    this.setTimelineEventLocations();
    this.mapEventsToCategories();
  }

  resetEvents() {
    this.timeline.events = [];

    for (const event of this.timelineEvents) {
      this.timeline.events.push(event);
    }
  }

  setTimelineStartAndEnd() {
    const years = [];
    const year = new Date();

    let endYear = year.getFullYear();

    for ( const event of this.timeline.events) {
      if (event.startEra.label === 'BC') {
        event.startYear = event.startYear * -1;
      }

      if (event.endEra && event.endEra.label === 'BC') {
        event.endYear = event.endYear * -1;
      }

      if (event.endYear) {
        endYear = event.endYear;
      } else {
        const dateObj = new Date();
        endYear = dateObj.getFullYear();
      }

      years.push(event.startYear);
      years.push(endYear);
    }

    if (this.timeline.persons && this.timeline.persons.length) {
      for (const person of this.timeline.persons) {
        if (person.birthEra.label === 'BC') {
          person.birthYear = person.birthYear * -1;
        }

        if (person.deathEra && person.deathEra.label === 'BC') {
          person.deathYear = person.deathYear * -1;
        }

        years.push(person.birthYear);

        if (person.deathYear) {
          years.push(person.deathYear);
        } else {
          const dateObj = new Date();
          years.push(dateObj.getFullYear());
        }
      }
    }

    // sort ascending
    years.sort((a, b) => {
      return a - b;
    });

    const earliestEvent = years[0];
    const oldestEvent = years[years.length - 1];
    const distance = oldestEvent - earliestEvent;

    this.timelineSpanInYears = distance;

    this.timelineStart = Math.floor(TimelineComponent.padTimelineDate(earliestEvent, distance, false));
    this.timelineEnd = Math.ceil(TimelineComponent.padTimelineDate(oldestEvent, distance, true));

    this.timelineLength = this.timelineEnd - this.timelineStart;
  }

  setTimeframe() {
    const tmpEvent = new Event();

    this.timeframe = [];

    let numberOfDivisions = 11;

    let lengthOfSection = 0;

    // if less than the minYearToMonths value then the time span should be by single year.
    if (this.timelineLength < this.minYearToMonths) {
      numberOfDivisions = this.timelineLength;
      lengthOfSection = Math.round(this.timelineLength / numberOfDivisions);
    } else {
      lengthOfSection = Math.round(this.timelineLength / (numberOfDivisions - 1));
    }

    let loopedDivisions = numberOfDivisions;

    if (this.timelineLength < this.minYearToMonths) {
      loopedDivisions = numberOfDivisions + 1;
    }

    let divisionYear = 0;
    let percentage = 0;

    for (let i = 0; i < loopedDivisions; i++) {
      const segment = {
        leftPercentage: '',
        year: ''
      };

      // The first division should be equal to the timeline start date
      if (i === 0) {
        tmpEvent.startYear = this.timelineStart;
        tmpEvent.startEra = new Era();

        if (this.timelineStart < 0) {
          tmpEvent.startEra.label = 'BC';

        } else {
          tmpEvent.startEra.label = 'AD';
        }

        tmpEvent.formatYears();

        divisionYear = this.timelineStart;
        segment.leftPercentage = '-1px';
        segment.year = tmpEvent.formattedStartYear;

        this.timeframe.push(segment);

        continue;
      }

      // last segment in timeline should be equal to end year of timeline
      if (i === numberOfDivisions - 1) {
        tmpEvent.endYear = this.timelineEnd;
        tmpEvent.endEra = new Era();

        segment.leftPercentage = '100%';

        if (this.timelineEnd < 0) {
          tmpEvent.endEra.label = 'BC';

        } else  {
          tmpEvent.endEra.label = 'AD';
        }

        tmpEvent.formatYears();

        segment.year = tmpEvent.formattedEndYear;

        this.timeframe.push(segment);

        continue;
      }

      // calculate years on segments in the middle
      divisionYear = divisionYear + lengthOfSection;

      tmpEvent.startYear = divisionYear;

      if (divisionYear < 0) {
        tmpEvent.startEra.label = 'BC';
      } else {
        tmpEvent.startEra.label = 'AD';
      }

      tmpEvent.formatYears();

      if (numberOfDivisions < this.minYearToMonths) {
        percentage = percentage + (100 / numberOfDivisions);
      } else {
        percentage = percentage + 10;
      }

      segment.year = tmpEvent.formattedStartYear;
      segment.leftPercentage = percentage.toString() + '%';

      this.timeframe.push(segment);
    }
  }

  mapEventsToCategories() {
    const eventIdsUsed = [];
    let backupColorArray = [];

    this.eventColorClasses.reverse();

    // assign the events to each respective category
    for (const category of this.timeline.categories) {
      if (category.events.length) {
        const newCategory = new Category();

        newCategory.id = category.id;
        newCategory.label = category.label;

        for (const categoryEvent of category.events) {
          const eventId = categoryEvent[1];

          for (const event of this.timeline.events) {
            if (event.id === eventId) {
              if (event.formattedStartDate === event.formattedEndDate) {
                newCategory.singlePointEvents.push(event);

                eventIdsUsed.push(eventId);

              } else {
                if (this.eventColorClasses.length) {
                  const color = this.eventColorClasses.pop();

                  event.colorClass = color;
                  backupColorArray.push(color);

                  if (!this.eventColorClasses.length) {
                    for (const backupColor of backupColorArray) {
                      this.eventColorClasses.push(backupColor);
                    }

                    this.eventColorClasses.reverse();

                    backupColorArray = [];
                  }
                }

                newCategory.multiPointEvents.push(event);

                eventIdsUsed.push(eventId);
              }
            }
          }
        }

        // sort the events in a category oldest to newest
        if (newCategory.multiPointEvents.length) {
          newCategory.multiPointEvents.sort((a, b) => {
            return a.startYear - b.startYear;
          });
        }

        this.categoryEvents.push(newCategory);
      }
    }

    // for any events not assigned to category create a generic category to contain them
    const genericCategory = new Category();

    genericCategory.id = null;
    genericCategory.label = '';

    for (const event of this.timeline.events) {
      if (!eventIdsUsed.includes(event.id)) {
        if (event.formattedStartDate === event.formattedEndDate) {
          genericCategory.singlePointEvents.push(event);

        } else {
          if (this.eventColorClasses.length) {
            const color = this.eventColorClasses.pop();

            event.colorClass = color;
            backupColorArray.push(color);

            if (!this.eventColorClasses.length) {
              for (const backupColor of backupColorArray) {
                this.eventColorClasses.push(backupColor);
              }

              this.eventColorClasses.reverse();

              backupColorArray = [];
            }
          }

          genericCategory.multiPointEvents.push(event);
        }
      }
    }

    this.categoryEvents.push(genericCategory);

    this.categoryEvents.reverse();
  }

  setPersons() {
    if (this.timeline.persons && this.timeline.persons.length) {
      for (const person of this.timeline.persons) {
        this.persons.push(person);
      }
    }
  }

  filterEvents() {
    this.timeline.events = this.timeline.events.filter(event => {
      if (TimelineComponent.convertPolarity(event.startYear, event) < this.timelineStart) {
        return false;
      } else if (TimelineComponent.convertPolarity(event.endYear, event) > this.timelineEnd) {
        return false;
      }

      return true;
    });
  }

  setTimelineEventLocations() {
    console.log('seeting loction');
    // if the timeline is less than some minimum length create percentages based on month instead of year
    if (this.timelineLength <= this.minYearToMonths) {
      const timelineLengthInMonths = this.timelineLength * 12;

      for (const event of this.timeline.events) {
        let startMonthInTimeline = ((event.startYear - this.timelineStart) * 12);

        if (event.startMonth) {
          startMonthInTimeline = startMonthInTimeline + Number(event.startMonth.id);
        }

        event.timelineStartLocation = (startMonthInTimeline / timelineLengthInMonths) * 100;

        let endMonthInTimeline = ((event.endYear - this.timelineStart) * 12);

        if (event.endMonth) {
          endMonthInTimeline = endMonthInTimeline + Number(event.endMonth.id);
        }

        let endPercentage = (endMonthInTimeline / timelineLengthInMonths) * 100 - event.timelineStartLocation;

        // if the range is 0% change to 1% so it shows up on the timeline
        if (endPercentage < 1 && event.formattedStartDate !== event.formattedEndDate) {
          endPercentage = 1;
        }

        event.timelineEndLocation = endPercentage;
      }

    } else {
      for (const event of this.timeline.events) {
        // set the percentage location from oldest event.
        event.timelineStartLocation = ((event.startYear - this.timelineStart) / this.timelineLength) * 100;

        let endYear = event.endYear;

        if (!endYear) {
          const year = new Date();
          endYear = year.getFullYear();
        }

        let endPercentage = (((endYear - this.timelineStart) / this.timelineLength) * 100) - event.timelineStartLocation;

        // if the range is 0% change to 1% so it shows up on the timeline
        if (endPercentage < 1 && event.formattedStartDate !== event.formattedEndDate) {
          endPercentage = 1;
        }

        event.timelineEndLocation = endPercentage;
      }
    }
  }

  setTimelinePersonLocations() {
    if (this.timeline.persons && this.timeline.persons.length) {
      for (const person of this.timeline.persons) {
        // set the percentage location from oldest event.
        person.timelineStartLocation = ((person.birthYear - this.timelineStart) / this.timelineLength) * 100;

        let deathYear = person.deathYear;

        // in the case that the person is still alive
        if (!deathYear) {
          const dateObj = new Date();
          deathYear = dateObj.getFullYear();
        }

        person.timelineEndLocation = (((deathYear - this.timelineStart) / this.timelineLength) * 100) - person.timelineStartLocation;
      }
    }
  }

  getRelatedEvents(path, isPageLink) {
    this.eventService.getApiEvents(path, null, [this.timelineStart, this.timelineEnd], isPageLink).subscribe(response => {
      this.relatedEvents = response.events;

      this.relatedEventsTotalResults = response.total;
      this.relatedEventsPreviousPage = response.links.previous;
      this.relatedEventsNextPage = response.links.next;

      this.relatedEvents = this.relatedEvents.filter((el) => {
        if (!this.timeline.events.find((ev) => ev.id === el.id)) {
          return el;
        }
      });
    });
  }

  showCursorLine($event) {
    const timelineContainerElement = document.getElementById('timeline-container');

    this.cursorLineActive = true;
    const xPosition = $event.clientX;

    const height = timelineContainerElement.offsetHeight;

    this.cursorLineStyles = {
      left: xPosition + 'px',
      height: height + 'px'
    };

    const timelineWidth = timelineContainerElement.offsetWidth;
    const timelineLeftOffset = timelineContainerElement.offsetLeft;

    const cursorXInDiv = xPosition - timelineLeftOffset;

    const pixelsByYear = timelineWidth / this.timelineLength;
    const numberOfYearsOffset = cursorXInDiv / pixelsByYear;

    const lineDate: number = Math.floor(this.timelineStart + numberOfYearsOffset);

    const tmpEvent = new Event();
    tmpEvent.startYear = lineDate;
    tmpEvent.startEra = new Era();

    if (lineDate < 0) {
      tmpEvent.startEra.label = 'BC';
    } else {
      tmpEvent.startEra.label = 'AD';
    }

    tmpEvent.formatYears();

    this.cursorLineDate = tmpEvent.formattedStartYear;
  }

  removeTimeline() {
    console.log('Removing Timeline: ', this.timeline);
  }

  activateTimelineEditMode() {
    this.cursorLineActive = false;
    this.isTimelineEditMode = true;
  }

  closeTimelineEditoMode() {
    this.isTimelineEditMode = false;
  }

  editTimeline() {
    this.timelineService.patchApiTimeline(this.timeline).subscribe(() => {
      this.isTimelineEditMode = false;
    });
  }

  createEvent() {
    const dialogRef = this.dialog.open(QuickEventComponent, {
      width: '750px'
    });

    dialogRef.afterClosed().subscribe(event => {
      if (event) {
        console.log(event);
        this.eventService.createApiEvent(event).subscribe(newEventResponse => {
          event.id = newEventResponse.data.id;

          event.formatYears();
          event.formatDates();

          const timelineEvent = new TimelineEvent();
          timelineEvent.initializeNewTimelineEvent();

          timelineEvent.event = event;
          timelineEvent.timeline = this.timeline;

          this.timelineService.createEventApiTimeline(timelineEvent).subscribe(timelineEventResponse => {
            timelineEvent.id = timelineEventResponse.data.id;

            this.timeline.events.push(event);

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

            this.setTimelineEventLocations();
          });
        });
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

  // calculateTimeline() {
  //   // reset the timeline to the original full list
  //   this.timeline.events = [];
  //
  //   for (const event of this.timelineEvents) {
  //     this.timeline.events.push(event);
  //   }
  //
  //   this.timeline.events = this.timeline.events.filter(event => {
  //     if (this.convertPolarity(event.startYear, event) < this.pointerStart) {
  //       return false;
  //     } else if (this.convertPolarity(event.startYear, event) > this.pointerEnd) {
  //       return false;
  //     }
  //
  //     return true;
  //   });
  //
  //   this.oldestEvent = this.timeline.events[0];
  //   this.newestEvent = this.timeline.events[this.timeline.events.length - 1];
  //
  //   let distanceBetweenEvents = this.timelineStart - this.timelineEnd;
  //
  //   if (distanceBetweenEvents < 0) {
  //     distanceBetweenEvents = distanceBetweenEvents * -1;
  //   }
  //
  //   this.timelineLengthInYears = this.padTimelineDate(this.timelineStart, distanceBetweenEvents, false) -
  //     this.padTimelineDate(this.timelineEnd, distanceBetweenEvents, true);
  //
  //   this.staticLengthInYears = this.timelineStart - this.timelineEnd;
  //
  //   // length in years should always be a positive number
  //   if (this.timelineLengthInYears < 0) {
  //     this.timelineLengthInYears = this.timelineLengthInYears * -1;
  //     this.staticLengthInYears = this.staticLengthInYears * -1;
  //   }
  //
  //   for (const event of this.timeline.events) {
  //     // set the percentage location from oldest event.
  //     console.log('Start Year: ', event.startYear);
  //     console.log('Length: ', this.timelineLengthInYears);
  //     const percentage = 100 - ((event.startYear / this.timelineLengthInYears) * 100).toPrecision(2);
  //     event.timelineStartLocation = percentage.toLocaleString();
  //     console.log('Event: ', event.label, ' Location: ', event.timelineStartLocation);
  //   }
  //
  //   this.options = {
  //     floor: this.padTimelineDate(this.timelineStart, this.timelineLengthInYears, false),
  //     ceil: this.padTimelineDate(this.timelineEnd, this.timelineLengthInYears, true),
  //     tickStep: this.staticLengthInYears / 10,
  //     showTicks: true,
  //     showTicksValues: true,
  //     translate: (value: number): string => {
  //       const event = new Event();
  //       const era = new Era();
  //
  //       era.initializeNewEra();
  //       event.initializeNewEvent();
  //
  //       era.label = 'AD';
  //
  //       if (value < 0) {
  //         value = value * -1;
  //         era.label = 'BC';
  //       }
  //
  //       event.formatYears(true, null, value, era);
  //
  //       let newValue = event.formattedStartYear;
  //
  //       newValue = newValue.toLocaleString('en').toString();
  //
  //       return newValue;
  //     }
  //   };
  // }

  private sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
