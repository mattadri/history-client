import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EssayPersonComponent } from './essay-person.component';

describe('EssayPersonComponent', () => {
  let component: EssayPersonComponent;
  let fixture: ComponentFixture<EssayPersonComponent>;

  beforeEach(waitForAsync(() => {
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
