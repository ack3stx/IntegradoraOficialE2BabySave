import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentials } from '../../models/login-credentials';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router)

  private ruta = environment.apiUrl + '/auth/login';

  constructor(private http: HttpClient) {
   }
   
  login(apiLogin: LoginCredentials): Observable<any> {
    const respuesta = Observable<any>;
    console.log(respuesta);
    return this.http.post(this.ruta, apiLogin);
  }

  logout() {
    this.RemoverToken();
    this.router.navigateByUrl('login');
  }

  public RemoverToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  }

  public LeerToken(): string | null {
    const sessionToken = sessionStorage.getItem('token');
    if (sessionToken) {
      return sessionToken;
    }
    else{
      return localStorage.getItem('token');
    }
  }

  Autenticado(): boolean {
    return !!this.LeerToken();
  }
  
}