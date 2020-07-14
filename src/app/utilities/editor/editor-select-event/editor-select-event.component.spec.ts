import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSelectEventComponent } from './editor-select-event.component';

describe('EditorSelectEventComponent', () => {
  let component: EditorSelectEventComponent;
  let fixture: ComponentFixture<EditorSelectEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSelectEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSelectEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
