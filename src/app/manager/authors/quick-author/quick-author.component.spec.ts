import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickAuthorComponent } from './quick-author.component';

describe('QuickAuthorComponent', () => {
  let component: QuickAuthorComponent;
  let fixture: ComponentFixture<QuickAuthorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickAuthorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
