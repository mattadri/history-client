import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePersonListComponent } from './timeline-person-list.component';

describe('TimelinePersonListComponent', () => {
  let component: TimelinePersonListComponent;
  let fixture: ComponentFixture<TimelinePersonListComponent>;

  beforeEach(async(() => {
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
