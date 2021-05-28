import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailsAddTimelineComponent } from './person-details-add-timeline.component';

describe('PersonDetailsAddTimelineComponent', () => {
  let component: PersonDetailsAddTimelineComponent;
  let fixture: ComponentFixture<PersonDetailsAddTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonDetailsAddTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailsAddTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
