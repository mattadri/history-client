import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayCardComponent } from './essay-card.component';

describe('EssayCardComponent', () => {
  let component: EssayCardComponent;
  let fixture: ComponentFixture<EssayCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
