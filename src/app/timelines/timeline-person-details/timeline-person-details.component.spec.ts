import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelinePersonDetailsComponent } from './timeline-person-details.component';

describe('TimelinePersonDetailsComponent', () => {
  let component: TimelinePersonDetailsComponent;
  let fixture: ComponentFixture<TimelinePersonDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinePersonDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinePersonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
