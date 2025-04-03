import { TestBed } from '@angular/core/testing';

import { StatusbocinaService } from './statusbocina.service';

describe('StatusbocinaService', () => {
  let service: StatusbocinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusbocinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
