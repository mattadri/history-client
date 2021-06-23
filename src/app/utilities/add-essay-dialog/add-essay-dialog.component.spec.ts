import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEssayDialogComponent } from './add-essay-dialog.component';

describe('AddEssayDialogComponent', () => {
  let component: AddEssayDialogComponent;
  let fixture: ComponentFixture<AddEssayDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEssayDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEssayDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
