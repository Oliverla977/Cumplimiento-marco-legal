import { TestBed } from '@angular/core/testing';

import { MarcolegalService } from './marcolegal.service';

describe('MarcolegalService', () => {
  let service: MarcolegalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarcolegalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
