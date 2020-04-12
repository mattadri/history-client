import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineEventDetailNoteComponent } from './timeline-event-detail-note.component';

describe('TimelineEventDetailNoteComponent', () => {
  let component: TimelineEventDetailNoteComponent;
  let fixture: ComponentFixture<TimelineEventDetailNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineEventDetailNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineEventDetailNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
