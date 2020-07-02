import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailsNoteComponent } from './person-details-note.component';

describe('PersonDetailsNoteComponent', () => {
  let component: PersonDetailsNoteComponent;
  let fixture: ComponentFixture<PersonDetailsNoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonDetailsNoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailsNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
