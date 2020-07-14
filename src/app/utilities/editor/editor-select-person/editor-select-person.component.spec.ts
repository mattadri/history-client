import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSelectPersonComponent } from './editor-select-person.component';

describe('EditorSelectPersonComponent', () => {
  let component: EditorSelectPersonComponent;
  let fixture: ComponentFixture<EditorSelectPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSelectPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSelectPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
