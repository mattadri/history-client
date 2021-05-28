import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailsAddBiographyComponent } from './person-details-add-biography.component';

describe('PersonDetailsAddBiographyComponent', () => {
  let component: PersonDetailsAddBiographyComponent;
  let fixture: ComponentFixture<PersonDetailsAddBiographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonDetailsAddBiographyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailsAddBiographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
