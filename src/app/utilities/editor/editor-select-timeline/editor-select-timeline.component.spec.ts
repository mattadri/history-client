import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSelectTimelineComponent } from './editor-select-timeline.component';

describe('EditorSelectTimelineComponent', () => {
  let component: EditorSelectTimelineComponent;
  let fixture: ComponentFixture<EditorSelectTimelineComponent>;

  beforeEach(async(() => {
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
