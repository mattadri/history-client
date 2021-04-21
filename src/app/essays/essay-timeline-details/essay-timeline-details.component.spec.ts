import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayTimelineDetailsComponent } from './essay-timeline-details.component';

describe('EssayTimelineDetailsComponent', () => {
  let component: EssayTimelineDetailsComponent;
  let fixture: ComponentFixture<EssayTimelineDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayTimelineDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayTimelineDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
