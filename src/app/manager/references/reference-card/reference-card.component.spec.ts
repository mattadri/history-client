import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceCardComponent } from './reference-card.component';

describe('ReferenceCardComponent', () => {
  let component: ReferenceCardComponent;
  let fixture: ComponentFixture<ReferenceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
