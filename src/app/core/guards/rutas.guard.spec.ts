import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { rutasGuard } from './rutas.guard';

describe('rutasGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rutasGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
