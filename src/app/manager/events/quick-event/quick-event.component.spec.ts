import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickEventComponent } from './quick-event.component';

describe('QuickEventComponent', () => {
  let component: QuickEventComponent;
  let fixture: ComponentFixture<QuickEventComponent>;

  beforeEach(async(() => {
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
