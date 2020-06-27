import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainstormsComponent } from './brainstorms.component';

describe('BrainstormsComponent', () => {
  let component: BrainstormsComponent;
  let fixture: ComponentFixture<BrainstormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrainstormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainstormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
