import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelinePersonComponent } from './timeline-person.component';

describe('TimelinePersonComponent', () => {
  let component: TimelinePersonComponent;
  let fixture: ComponentFixture<TimelinePersonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinePersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinePersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
