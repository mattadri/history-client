import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssaysComponent } from './essays.component';

describe('EssaysComponent', () => {
  let component: EssaysComponent;
  let fixture: ComponentFixture<EssaysComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
