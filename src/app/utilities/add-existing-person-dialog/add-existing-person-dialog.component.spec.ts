import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingPersonDialogComponent } from './add-existing-person-dialog.component';

describe('AddExistingPersonDialogComponent', () => {
  let component: AddExistingPersonDialogComponent;
  let fixture: ComponentFixture<AddExistingPersonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExistingPersonDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExistingPersonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
