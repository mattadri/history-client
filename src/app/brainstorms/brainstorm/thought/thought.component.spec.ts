import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ThoughtComponent } from './thought.component';

describe('ThoughtComponent', () => {
  let component: ThoughtComponent;
  let fixture: ComponentFixture<ThoughtComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
