import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayTimelineComponent } from './essay-timeline.component';

describe('EssayTimelineComponent', () => {
  let component: EssayTimelineComponent;
  let fixture: ComponentFixture<EssayTimelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
