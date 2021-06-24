import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {Sleep} from '../../../utilities/sleep';

import {Category} from '../../../models/category';
import {Person} from '../../../models/persons/person';
import {Event} from '../../../models/events/event';
import {Era} from '../../../models/era';
import {Timeline} from '../../../models/timelines/timeline';
import {TimelineService} from '../../../services/timeline.service';

@Component({
  selector: 'app-timeline-display',
  templateUrl: './timeline-display.component.html',
  styleUrls: ['./timeline-display.component.scss', '../timeline.component.scss']
})
export class TimelineDisplayComponent implements OnInit {
  @Input() public timeline: Timeline;

  @Output() private returnTimelineSpan: EventEmitter<number>;
  @Output() private returnTimelineStartEndYears: EventEmitter<Array<number>>;
  @Output() private returnCategoryEvents: EventEmitter<Category[]>;

  public cursorLineActive: boolean;
  public cursorLineStyles: object;
  public cursorLineDate: string;
  public cursorLineDatePosition: string;
  public timeframe: any[];
  public persons: Person[];
  public timelineStart: number;
  public timelineEnd: number;
  public timelineSpanInYears: number;
  public categoryEvents: Category[];

  public timelineLoaded: boolean;

  private timelineLength: number;
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

  constructor(private timelineService: TimelineService) {
    this.returnTimelineSpan = new EventEmitter();
    this.returnTimelineStartEndYears = new EventEmitter();
    this.returnCategoryEvents = new EventEmitter();

    this.cursorLineActive = false;
    this.cursorLineDatePosition = 'above';

    this.persons = [];

    this.timelineLoaded = false;
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

  ngOnInit() {
    // the timeline passed in is not a full timeline. Get the full timeline and mark loaded.
    let loadedTimeline = this.timelineService.getTimeline(this.timeline.id);

    if (loadedTimeline) {
      this.timeline = loadedTimeline;
      this.timelineLoaded = true;

      this.fullTimelineInit();

    } else {
      this.timelineService.getApiTimeline(this.timeline.id).subscribe((responseTimeline) => {
        this.timeline = responseTimeline;
        this.timelineLoaded = true;

        this.timelineService.setTimeline(this.timeline);

        this.fullTimelineInit();
      });
    }
  }

  fullTimelineInit() {
    for (const timelinePerson of this.timeline.persons) {
      this.persons.push(timelinePerson.person);
    }

    this.setTimelineStartAndEnd();
    this.setTimeframe();

    this.setTimelineEventLocations();
    this.setTimelinePersonLocations();

    this.categoryEvents = [];
    this.mapEventsToCategories();
  }

  setTimelineStartAndEnd() {
    const years = [];
    const year = new Date();

    let endYear = year.getFullYear();

    if (this.timeline.events && this.timeline.events.length) {
      for ( const timelineEvent of this.timeline.events) {
        if (timelineEvent.event.startEra.label === 'BC') {
          timelineEvent.event.startYear = timelineEvent.event.startYear * -1;
        }

        if (timelineEvent.event.endEra && timelineEvent.event.endEra.label === 'BC') {
          timelineEvent.event.endYear = timelineEvent.event.endYear * -1;
        }

        if (timelineEvent.event.endYear) {
          endYear = timelineEvent.event.endYear;
        } else {
          const dateObj = new Date();
          endYear = dateObj.getFullYear();
        }

        years.push(timelineEvent.event.startYear);
        years.push(endYear);
      }
    }

    if (this.timeline.persons && this.timeline.persons.length) {
      for (const timelinePerson of this.timeline.persons) {
        let person = timelinePerson.person;

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

    // in the case of a timeline with no events
    if (!distance) {
      this.timelineSpanInYears = 0;
    } else {
      this.timelineSpanInYears = distance;
    }

    this.timelineStart = Math.floor(TimelineDisplayComponent.padTimelineDate(earliestEvent, distance, false));
    this.timelineEnd = Math.ceil(TimelineDisplayComponent.padTimelineDate(oldestEvent, distance, true));

    this.timelineLength = this.timelineEnd - this.timelineStart;

    this.returnTimelineSpan.emit(this.timelineSpanInYears);

    this.returnTimelineStartEndYears.emit([this.timelineStart, this.timelineEnd]);
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
    if (this.timeline.categories && this.timeline.categories.length) {
      for (const category of this.timeline.categories) {
        if (category.events.length) {
          const newCategory = new Category();

          newCategory.id = category.id;
          newCategory.label = category.label;

          if (category.events && category.events.length) {
            for (const categoryEvent of category.events) {
              const eventId = categoryEvent[1];

              if (this.timeline.events && this.timeline.events.length) {
                for (const timelineEvent of this.timeline.events) {
                  if (timelineEvent.event.id === eventId) {
                    if (timelineEvent.event.formattedStartDate === timelineEvent.event.formattedEndDate) {
                      newCategory.singlePointEvents.push(timelineEvent.event);

                      eventIdsUsed.push(eventId);

                    } else {
                      if (this.eventColorClasses.length) {
                        const color = this.eventColorClasses.pop();

                        timelineEvent.event.colorClass = color;
                        backupColorArray.push(color);

                        if (!this.eventColorClasses.length) {
                          for (const backupColor of backupColorArray) {
                            this.eventColorClasses.push(backupColor);
                          }

                          this.eventColorClasses.reverse();

                          backupColorArray = [];
                        }
                      }

                      newCategory.multiPointEvents.push(timelineEvent.event);

                      eventIdsUsed.push(eventId);
                    }
                  }
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
    }

    // for any events not assigned to category create a generic category to contain them
    const genericCategory = new Category();

    genericCategory.id = null;
    genericCategory.label = '';

    if (this.timeline.events && this.timeline.events.length) {
      for (const timelineEvent of this.timeline.events) {
        if (!eventIdsUsed.includes(timelineEvent.event.id)) {
          if (timelineEvent.event.formattedStartDate === timelineEvent.event.formattedEndDate) {
            genericCategory.singlePointEvents.push(timelineEvent.event);

          } else {
            if (this.eventColorClasses.length) {
              const color = this.eventColorClasses.pop();

              timelineEvent.event.colorClass = color;
              backupColorArray.push(color);

              if (!this.eventColorClasses.length) {
                for (const backupColor of backupColorArray) {
                  this.eventColorClasses.push(backupColor);
                }

                this.eventColorClasses.reverse();

                backupColorArray = [];
              }
            }

            genericCategory.multiPointEvents.push(timelineEvent.event);
          }
        }
      }
    }


    this.categoryEvents.push(genericCategory);

    this.categoryEvents.reverse();

    this.returnCategoryEvents.emit(this.categoryEvents);
  }

  setTimelineEventLocations() {
    // if the timeline is less than some minimum length create percentages based on month instead of year
    if (this.timelineLength <= this.minYearToMonths) {
      const timelineLengthInMonths = this.timelineLength * 12;

      if (this.timeline.events && this.timeline.events.length) {
        for (const timelineEvent of this.timeline.events) {
          let startMonthInTimeline = ((timelineEvent.event.startYear - this.timelineStart) * 12);

          if (timelineEvent.event.startMonth) {
            startMonthInTimeline = startMonthInTimeline + Number(timelineEvent.event.startMonth.id);
          }

          timelineEvent.event.timelineStartLocation = (startMonthInTimeline / timelineLengthInMonths) * 100;

          let endMonthInTimeline = ((timelineEvent.event.endYear - this.timelineStart) * 12);

          if (timelineEvent.event.endMonth) {
            endMonthInTimeline = endMonthInTimeline + Number(timelineEvent.event.endMonth.id);
          }

          let endPercentage = (endMonthInTimeline / timelineLengthInMonths) * 100 - timelineEvent.event.timelineStartLocation;

          // if the range is 0% change to 1% so it shows up on the timeline
          if (endPercentage < 1 && timelineEvent.event.formattedStartDate !== timelineEvent.event.formattedEndDate) {
            endPercentage = 1;
          }

          timelineEvent.event.timelineEndLocation = endPercentage;
        }
      }

    } else {
      if (this.timeline.events && this.timeline.events.length) {
        for (const timelineEvent of this.timeline.events) {
          // set the percentage location from oldest event.
          timelineEvent.event.timelineStartLocation = ((timelineEvent.event.startYear - this.timelineStart) / this.timelineLength) * 100;

          let endYear = timelineEvent.event.endYear;

          if (!endYear) {
            const year = new Date();
            endYear = year.getFullYear();
          }

          let endPercentage = (((endYear - this.timelineStart) / this.timelineLength) * 100) - timelineEvent.event.timelineStartLocation;

          // if the range is 0% change to 1% so it shows up on the timeline
          if (endPercentage < 1 && timelineEvent.event.formattedStartDate !== timelineEvent.event.formattedEndDate) {
            endPercentage = 1;
          }

          timelineEvent.event.timelineEndLocation = endPercentage;
        }
      }
    }
  }

  setTimelinePersonLocations() {
    if (this.timeline.persons && this.timeline.persons.length) {
      for (const timelinePerson of this.timeline.persons) {
        let person = timelinePerson.person;

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

  showCursorLine($event) {
    const timelineContainerElement = document.getElementById('timeline-container');
    const timelineDescriptionElement = document.getElementById('timeline-description');

    this.cursorLineActive = true;
    const xPosition = $event.clientX;

    // const height = timelineContainerElement.offsetHeight;
    const height = timelineContainerElement.offsetHeight;
    let top = 210;

    if (this.timeline.description) {
      top = timelineContainerElement.offsetHeight + timelineDescriptionElement.offsetHeight;
    }

    this.cursorLineStyles = {
      left: xPosition + 'px',
      height: height + 'px',
      top: top + 'px'
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

  async showCursorTooltip(tooltip) {
    await Sleep.wait(100);

    tooltip.show();
  }
}
