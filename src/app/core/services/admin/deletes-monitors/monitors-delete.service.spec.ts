import { TestBed } from '@angular/core/testing';

import { MonitorsDeleteService } from './monitors-delete.service';

describe('MonitorsDeleteService', () => {
  let service: MonitorsDeleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonitorsDeleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
