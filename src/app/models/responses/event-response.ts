import {Event} from '../events/event';
import {EventTimeline} from '../events/event-timeline';
import {TimelineEvent} from '../timelines/timeline-event';

export class EventResponse {
  events: Event[];
  links: any;
  total: number;
}

export class EventTimelinesResponse {
  eventTimelines: EventTimeline[];
  links: any;
  total: number;
}

export class TimelineEventsResponse {
  timelineEvents: TimelineEvent[];
  links: any;
  total: number;
}
