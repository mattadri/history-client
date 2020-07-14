import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineDisplayComponent } from './timeline-display.component';

describe('TimelineDisplayComponent', () => {
  let component: TimelineDisplayComponent;
  let fixture: ComponentFixture<TimelineDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
