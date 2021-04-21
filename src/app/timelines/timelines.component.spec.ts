import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelinesComponent } from './timelines.component';

describe('TimelinesComponent', () => {
  let component: TimelinesComponent;
  let fixture: ComponentFixture<TimelinesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelinesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
