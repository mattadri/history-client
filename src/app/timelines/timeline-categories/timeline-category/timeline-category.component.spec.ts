import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineCategoryComponent } from './timeline-category.component';

describe('TimelineCategoryComponent', () => {
  let component: TimelineCategoryComponent;
  let fixture: ComponentFixture<TimelineCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
