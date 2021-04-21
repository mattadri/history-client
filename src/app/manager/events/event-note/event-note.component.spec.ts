import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EventNoteComponent } from './event-note.component';

describe('EventNoteComponent', () => {
  let component: EventNoteComponent;
  let fixture: ComponentFixture<EventNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
