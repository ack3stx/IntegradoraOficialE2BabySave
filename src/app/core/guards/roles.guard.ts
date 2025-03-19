import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth/auth.service';

export const rolesGuard = (rol: number): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const auth = inject(AuthService);
    const token = auth.LeerToken();

    if (!token) {
      if (rol === 0) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }

    const decoded: any = jwtDecode(token);
    const userRole = decoded.rol ?? null;


    if (userRole === rol) {
      return true;
    } else {
      switch (userRole) {
            case 1:
              router.navigate(['/activar']);
              break;
            case 2:
              router.navigate(['/dashboard']);
              break;
            case 3:
              router.navigate(['/admin']);
              break;
            default:
              router.navigate(['/']);
          }
      return false;
    }

  };
};
