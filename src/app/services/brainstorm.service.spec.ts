import { TestBed } from '@angular/core/testing';

import { BrainstormService } from './brainstorm.service';

describe('BrainstormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BrainstormService = TestBed.get(BrainstormService);
    expect(service).toBeTruthy();
  });
});
