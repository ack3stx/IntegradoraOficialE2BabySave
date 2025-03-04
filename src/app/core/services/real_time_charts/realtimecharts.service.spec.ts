import { TestBed } from '@angular/core/testing';

import { RealtimechartsService } from './realtimecharts.service';

describe('RealtimechartsService', () => {
  let service: RealtimechartsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealtimechartsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
