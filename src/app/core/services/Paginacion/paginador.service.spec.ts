import { TestBed } from '@angular/core/testing';

import { PaginadorService } from './paginador.service';

describe('PaginadorService', () => {
  let service: PaginadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
