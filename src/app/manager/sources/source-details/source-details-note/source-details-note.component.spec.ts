import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SourceDetailsNoteComponent } from './source-details-note.component';

describe('SourceDetailsNoteComponent', () => {
  let component: SourceDetailsNoteComponent;
  let fixture: ComponentFixture<SourceDetailsNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceDetailsNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceDetailsNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
