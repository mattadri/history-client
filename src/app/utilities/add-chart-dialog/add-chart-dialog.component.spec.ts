import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChartDialogComponent } from './add-chart-dialog.component';

describe('AddChartDialogComponent', () => {
  let component: AddChartDialogComponent;
  let fixture: ComponentFixture<AddChartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChartDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
