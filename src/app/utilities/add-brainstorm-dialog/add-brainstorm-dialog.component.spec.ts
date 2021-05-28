import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrainstormDialogComponent } from './add-brainstorm-dialog.component';

describe('AddBrainstormDialogComponent', () => {
  let component: AddBrainstormDialogComponent;
  let fixture: ComponentFixture<AddBrainstormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBrainstormDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrainstormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
