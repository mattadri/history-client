import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorSelectSourceComponent } from './editor-select-source.component';

describe('EditorSelectSourceComponent', () => {
  let component: EditorSelectSourceComponent;
  let fixture: ComponentFixture<EditorSelectSourceComponent>;

  beforeEach(waitForAsync(() => {
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
