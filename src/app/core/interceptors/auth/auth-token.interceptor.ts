import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { empty } from 'rxjs';
import { inject } from '@angular/core';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  // OBTENEMOS EL TOKEN DEL LOCALSTORAGE

  
  const authService = inject(AuthService);
  
  const token = authService.LeerToken();  

  // SU HAY UN TOKEN 
  if (token) {
    // CLONAMOS LA PETICION ORIGINAL Y LE AGREGAMOS EL TOKEN EN EL HEADER
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // CONTINUAMOS CON LA PETICION MODIFICADA
    return next(authReq);
  }
  // LO REDIRIGIMOS A DONDE IBA
  return next(req);
};