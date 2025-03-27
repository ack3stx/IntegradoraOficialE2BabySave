import { TestBed } from '@angular/core/testing';

import { ReporteMonitoresService } from './reporte-monitores.service';

describe('ReporteMonitoresService', () => {
  let service: ReporteMonitoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteMonitoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
