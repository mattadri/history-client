import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorSelectTimelineComponent } from './editor-select-timeline.component';

describe('EditorSelectTimelineComponent', () => {
  let component: EditorSelectTimelineComponent;
  let fixture: ComponentFixture<EditorSelectTimelineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSelectTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSelectTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
