import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorSelectChartComponent } from './editor-select-chart.component';

describe('EditorSelectChartComponent', () => {
  let component: EditorSelectChartComponent;
  let fixture: ComponentFixture<EditorSelectChartComponent>;

  beforeEach(async(() => {
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
