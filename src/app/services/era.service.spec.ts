import { TestBed } from '@angular/core/testing';

import { EraService } from './era.service';

describe('EraService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EraService = TestBed.get(EraService);
    expect(service).toBeTruthy();
  });
});
