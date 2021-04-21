import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayChartDetailsComponent } from './essay-chart-details.component';

describe('EssayChartDetailsComponent', () => {
  let component: EssayChartDetailsComponent;
  let fixture: ComponentFixture<EssayChartDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayChartDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayChartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
