import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSourceComponent } from './quick-source.component';

describe('QuickSourceComponent', () => {
  let component: QuickSourceComponent;
  let fixture: ComponentFixture<QuickSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
