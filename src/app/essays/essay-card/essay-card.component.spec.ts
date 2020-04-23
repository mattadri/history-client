import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayCardComponent } from './essay-card.component';

describe('EssayCardComponent', () => {
  let component: EssayCardComponent;
  let fixture: ComponentFixture<EssayCardComponent>;

  beforeEach(async(() => {
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
