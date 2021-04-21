import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayNoteComponent } from './essay-note.component';

describe('EssayNoteComponent', () => {
  let component: EssayNoteComponent;
  let fixture: ComponentFixture<EssayNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
