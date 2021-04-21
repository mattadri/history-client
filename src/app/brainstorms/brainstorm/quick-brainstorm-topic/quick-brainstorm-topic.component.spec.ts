import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickBrainstormTopicComponent } from './quick-brainstorm-topic.component';

describe('QuickBrainstormTopicComponent', () => {
  let component: QuickBrainstormTopicComponent;
  let fixture: ComponentFixture<QuickBrainstormTopicComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickBrainstormTopicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickBrainstormTopicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
