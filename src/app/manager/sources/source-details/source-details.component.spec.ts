import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SourceDetailsComponent } from './source-details.component';

describe('SourceDetailsComponent', () => {
  let component: SourceDetailsComponent;
  let fixture: ComponentFixture<SourceDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SourceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
