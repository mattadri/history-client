import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineEventDetailsComponent } from './timeline-event-details.component';

describe('TimelineEventDetailsComponent', () => {
  let component: TimelineEventDetailsComponent;
  let fixture: ComponentFixture<TimelineEventDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
