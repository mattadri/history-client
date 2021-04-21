import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimelineCategoriesComponent } from './timeline-categories.component';

describe('TimelineCategoriesComponent', () => {
  let component: TimelineCategoriesComponent;
  let fixture: ComponentFixture<TimelineCategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TimelineCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
