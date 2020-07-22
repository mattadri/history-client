import {Component, Input, OnInit} from '@angular/core';

import {Sleep} from '../../../utilities/sleep';

import {Category} from '../../../models/category';
import {Person} from '../../../models/person';
import {Event} from '../../../models/event';
import {Era} from '../../../models/era';
import {Timeline} from '../../../models/timeline';

@Component({
  selector: 'app-timeline-display',
  templateUrl: './timeline-display.component.html',
  styleUrls: ['./timeline-display.component.scss', '../timeline.component.scss']
})
export class TimelineDisplayComponent implements OnInit {
  @Input() public categoryEvents: Category[];
  @Input() public timeline: Timeline;

  public cursorLineActive: boolean;
  public cursorLineStyles: object;
  public cursorLineDate: string;
  public cursorLineDatePosition: string;
  public timeframe: any[];
  public persons: Person[];
  public timelineStart: number;
  public timelineEnd: number;
  public timelineSpanInYears: number;

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

  constructor() {
    this.cursorLineActive = false;
    this.cursorLineDatePosition = 'above';
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
    this.persons = this.timeline.persons;

    this.setTimelineStartAndEnd();
    this.setTimeframe();

    this.setTimelineEventLocations();
    this.setTimelinePersonLocations();

    if (!this.categoryEvents) {
      this.categoryEvents = [];
      this.mapEventsToCategories();
    }
  }

  setTimelineStartAndEnd() {
    const years = [];
    const year = new Date();

    let endYear = year.getFullYear();

    if (this.timeline.events && this.timeline.events.length) {
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

    this.timelineStart = Math.floor(TimelineDisplayComponent.padTimelineDate(earliestEvent, distance, false));
    this.timelineEnd = Math.ceil(TimelineDisplayComponent.padTimelineDate(oldestEvent, distance, true));

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
    }


    this.categoryEvents.push(genericCategory);

    this.categoryEvents.reverse();
  }

  setTimelineEventLocations() {
    // if the timeline is less than some minimum length create percentages based on month instead of year
    if (this.timelineLength <= this.minYearToMonths) {
      const timelineLengthInMonths = this.timelineLength * 12;

      if (this.timeline.events && this.timeline.events.length) {
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
      }

    } else {
      if (this.timeline.events && this.timeline.events.length) {
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

  async showCursorTooltip(tooltip) {
    await Sleep.wait(100);

    tooltip.show();
  }
}
