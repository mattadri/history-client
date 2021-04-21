import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SourceNoteExportComponent } from './source-note-export.component';

describe('SourceNoteExportComponent', () => {
  let component: SourceNoteExportComponent;
  let fixture: ComponentFixture<SourceNoteExportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceNoteExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceNoteExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
