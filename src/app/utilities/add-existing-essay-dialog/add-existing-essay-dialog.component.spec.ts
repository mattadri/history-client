import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingEssayDialogComponent } from './add-existing-essay-dialog.component';

describe('AddExistingEssayDialogComponent', () => {
  let component: AddExistingEssayDialogComponent;
  let fixture: ComponentFixture<AddExistingEssayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExistingEssayDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExistingEssayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
