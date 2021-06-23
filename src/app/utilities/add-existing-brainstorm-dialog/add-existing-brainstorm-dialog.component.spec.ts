import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingBrainstormDialogComponent } from './add-existing-brainstorm-dialog.component';

describe('AddExistingBrainstormDialogComponent', () => {
  let component: AddExistingBrainstormDialogComponent;
  let fixture: ComponentFixture<AddExistingBrainstormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExistingBrainstormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExistingBrainstormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
