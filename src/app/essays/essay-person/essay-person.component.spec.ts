import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssayPersonComponent } from './essay-person.component';

describe('EssayPersonComponent', () => {
  let component: EssayPersonComponent;
  let fixture: ComponentFixture<EssayPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssayPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssayPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
