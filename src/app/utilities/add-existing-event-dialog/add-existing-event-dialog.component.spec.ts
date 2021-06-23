import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingEventDialogComponent } from './add-existing-event-dialog.component';

describe('AddExistingEventDialogComponent', () => {
  let component: AddExistingEventDialogComponent;
  let fixture: ComponentFixture<AddExistingEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExistingEventDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExistingEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
