import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayPersonDetailsComponent } from './essay-person-details.component';

describe('EssayPersonDetailsComponent', () => {
  let component: EssayPersonDetailsComponent;
  let fixture: ComponentFixture<EssayPersonDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayPersonDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayPersonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
