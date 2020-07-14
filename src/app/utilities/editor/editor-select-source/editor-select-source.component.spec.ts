import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSelectSourceComponent } from './editor-select-source.component';

describe('EditorSelectSourceComponent', () => {
  let component: EditorSelectSourceComponent;
  let fixture: ComponentFixture<EditorSelectSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSelectSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSelectSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
