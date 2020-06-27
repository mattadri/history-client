import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainstormCardComponent } from './brainstorm-card.component';

describe('BrainstormCardComponent', () => {
  let component: BrainstormCardComponent;
  let fixture: ComponentFixture<BrainstormCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrainstormCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainstormCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
