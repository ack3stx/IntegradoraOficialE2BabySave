import { TestBed } from '@angular/core/testing';

import { ResendService } from './resend.service';

describe('ResendService', () => {
  let service: ResendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
