import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickPersonComponent } from './quick-person.component';

describe('QuickPersonComponent', () => {
  let component: QuickPersonComponent;
  let fixture: ComponentFixture<QuickPersonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
