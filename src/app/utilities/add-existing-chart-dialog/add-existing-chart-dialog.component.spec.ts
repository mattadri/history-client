import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExistingChartDialogComponent } from './add-existing-chart-dialog.component';

describe('AddExistingChartDialogComponent', () => {
  let component: AddExistingChartDialogComponent;
  let fixture: ComponentFixture<AddExistingChartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddExistingChartDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddExistingChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
