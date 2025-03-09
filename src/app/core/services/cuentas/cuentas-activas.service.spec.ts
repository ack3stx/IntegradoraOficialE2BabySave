import { TestBed } from '@angular/core/testing';

import { CuentasActivasService } from './cuentas-activas.service';

describe('CuentasActivasService', () => {
  let service: CuentasActivasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuentasActivasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
