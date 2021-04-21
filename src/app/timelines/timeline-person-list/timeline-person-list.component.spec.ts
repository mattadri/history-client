import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelinePersonListComponent } from './timeline-person-list.component';

describe('TimelinePersonListComponent', () => {
  let component: TimelinePersonListComponent;
  let fixture: ComponentFixture<TimelinePersonListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinePersonListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinePersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
