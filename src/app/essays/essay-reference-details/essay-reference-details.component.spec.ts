import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayReferenceDetailsComponent } from './essay-reference-details.component';

describe('EssayReferenceDetailsComponent', () => {
  let component: EssayReferenceDetailsComponent;
  let fixture: ComponentFixture<EssayReferenceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayReferenceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayReferenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
