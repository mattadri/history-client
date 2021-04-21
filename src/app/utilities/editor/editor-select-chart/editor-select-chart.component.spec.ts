import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditorSelectChartComponent } from './editor-select-chart.component';

describe('EditorSelectChartComponent', () => {
  let component: EditorSelectChartComponent;
  let fixture: ComponentFixture<EditorSelectChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorSelectChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorSelectChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
