import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingTimelineDialogComponent } from './add-existing-timeline-dialog.component';

describe('AddExistingTimelineDialogComponent', () => {
  let component: AddExistingTimelineDialogComponent;
  let fixture: ComponentFixture<AddExistingTimelineDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExistingTimelineDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExistingTimelineDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
