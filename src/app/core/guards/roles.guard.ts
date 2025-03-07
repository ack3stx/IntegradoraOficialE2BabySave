import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const rolesGuard = (rol: number): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (!token) {
      if (rol === 0) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    }

    try {
      const decoded: any = jwtDecode(token);
      const userRole = decoded.rol ?? null;

      if (rol === 0) {
        router.navigate(['/']);
        return false;
      }

      if (userRole === rol) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      router.navigate(['/login']);
      return false;
    }
  };
};
