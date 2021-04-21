import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventDetailsNoteComponent } from './event-details-note.component';

describe('EventDetailsNoteComponent', () => {
  let component: EventDetailsNoteComponent;
  let fixture: ComponentFixture<EventDetailsNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDetailsNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
