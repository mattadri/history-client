import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickEssayComponent } from './quick-essay.component';

describe('QuickEssayComponent', () => {
  let component: QuickEssayComponent;
  let fixture: ComponentFixture<QuickEssayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickEssayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickEssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
