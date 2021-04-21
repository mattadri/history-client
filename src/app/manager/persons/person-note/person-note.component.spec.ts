import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonNoteComponent } from './person-note.component';

describe('PersonNoteComponent', () => {
  let component: PersonNoteComponent;
  let fixture: ComponentFixture<PersonNoteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
