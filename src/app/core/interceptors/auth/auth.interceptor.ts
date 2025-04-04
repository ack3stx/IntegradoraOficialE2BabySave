import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const token = localStorage.getItem('token');
  const authService = inject(AuthService);
  
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error capturado en el interceptor:', error);

        if (error.status === 403 && req.url.includes('/login')) {
          return throwError(() => error); 
        }
    
        if (error.status === 403) {
          if (error.error?.error === 'Cuenta no activada.') {
            console.log('Eliminando token y redirigiendo al login...');
            authService.RemoverToken();
            toastr.warning('Tu cuenta ha sido desactivada por un administrador.', 'Lo sentimos', { timeOut: 10000 });
            router.navigate(['/login']);
          } else if (error.error?.error === 'Usuario no autenticado') {
            console.log('Cuenta no activada. Redirigiendo al login...');
            toastr.warning('Tu cuenta no ha sido activada.');
            authService.RemoverToken();
            router.navigate(['/login']);
          }
        } else if (error.status === 401) {
          console.log('Token inválido o expirado. Redirigiendo al login...');
          toastr.warning('Token inválido o expirado');
          authService.RemoverToken();
          router.navigate(['/login']);
        }
    
        return throwError(() => error);
      })
    );
  }