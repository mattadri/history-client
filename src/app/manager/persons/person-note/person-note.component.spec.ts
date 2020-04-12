import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonNoteComponent } from './person-note.component';

describe('PersonNoteComponent', () => {
  let component: PersonNoteComponent;
  let fixture: ComponentFixture<PersonNoteComponent>;

  beforeEach(async(() => {
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
