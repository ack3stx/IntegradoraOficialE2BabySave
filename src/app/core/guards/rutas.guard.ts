import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';


export const rutasGuard: CanMatchFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.Autenticado() ? true : router.createUrlTree(['login']);
};