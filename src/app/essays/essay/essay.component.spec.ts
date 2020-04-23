import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayComponent } from './essay.component';

describe('EssayComponent', () => {
  let component: EssayComponent;
  let fixture: ComponentFixture<EssayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
