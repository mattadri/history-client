import { TestBed } from '@angular/core/testing';

import { EssayService } from './essay.service';

describe('EssayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EssayService = TestBed.get(EssayService);
    expect(service).toBeTruthy();
  });
});
