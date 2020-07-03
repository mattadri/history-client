import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickBrainstormComponent } from './quick-brainstorm.component';

describe('QuickBrainstormComponent', () => {
  let component: QuickBrainstormComponent;
  let fixture: ComponentFixture<QuickBrainstormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickBrainstormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickBrainstormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
