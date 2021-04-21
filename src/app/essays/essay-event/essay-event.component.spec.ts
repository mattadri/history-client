import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayEventComponent } from './essay-event.component';

describe('EssayEventComponent', () => {
  let component: EssayEventComponent;
  let fixture: ComponentFixture<EssayEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
