import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmRemovalComponent } from './confirm-removal.component';

describe('ConfirmRemovalComponent', () => {
  let component: ConfirmRemovalComponent;
  let fixture: ComponentFixture<ConfirmRemovalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRemovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRemovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
