import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineEventListComponent } from './timeline-event-list.component';

describe('TimelineEventListComponent', () => {
  let component: TimelineEventListComponent;
  let fixture: ComponentFixture<TimelineEventListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineEventListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
