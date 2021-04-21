import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BrainstormComponent } from './brainstorm.component';

describe('BrainstormComponent', () => {
  let component: BrainstormComponent;
  let fixture: ComponentFixture<BrainstormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BrainstormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainstormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
