import { TestBed } from '@angular/core/testing';

import { ChartsServiceService } from './charts-service.service';

describe('ChartsServiceService', () => {
  let service: ChartsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
