import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickEventComponent } from './quick-event.component';

describe('QuickEventComponent', () => {
  let component: QuickEventComponent;
  let fixture: ComponentFixture<QuickEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
