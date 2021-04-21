import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PersonDetailsNoteComponent } from './person-details-note.component';

describe('PersonDetailsNoteComponent', () => {
  let component: PersonDetailsNoteComponent;
  let fixture: ComponentFixture<PersonDetailsNoteComponent>;

  beforeEach(waitForAsync(() => {
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
