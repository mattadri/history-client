import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayEventDetailsComponent } from './essay-event-details.component';

describe('EssayEventDetailsComponent', () => {
  let component: EssayEventDetailsComponent;
  let fixture: ComponentFixture<EssayEventDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayEventDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayEventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
