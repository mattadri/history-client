import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTimelineDialogComponent } from './add-timeline-dialog.component';

describe('AddTimelineDialogComponent', () => {
  let component: AddTimelineDialogComponent;
  let fixture: ComponentFixture<AddTimelineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTimelineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTimelineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
