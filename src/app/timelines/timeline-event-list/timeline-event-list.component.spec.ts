import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEventListComponent } from './timeline-event-list.component';

describe('TimelineEventListComponent', () => {
  let component: TimelineEventListComponent;
  let fixture: ComponentFixture<TimelineEventListComponent>;

  beforeEach(async(() => {
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
