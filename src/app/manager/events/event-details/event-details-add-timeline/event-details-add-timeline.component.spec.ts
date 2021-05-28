import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsAddTimelineComponent } from './event-details-add-timeline.component';

describe('EventDetailsAddTimelineComponent', () => {
  let component: EventDetailsAddTimelineComponent;
  let fixture: ComponentFixture<EventDetailsAddTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventDetailsAddTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsAddTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
