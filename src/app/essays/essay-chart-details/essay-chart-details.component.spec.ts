import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayChartDetailsComponent } from './essay-chart-details.component';

describe('EssayChartDetailsComponent', () => {
  let component: EssayChartDetailsComponent;
  let fixture: ComponentFixture<EssayChartDetailsComponent>;

  beforeEach(async(() => {
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
