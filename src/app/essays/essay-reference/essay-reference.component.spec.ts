import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayReferenceComponent } from './essay-reference.component';

describe('EssayReferenceComponent', () => {
  let component: EssayReferenceComponent;
  let fixture: ComponentFixture<EssayReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
