import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentials } from '../../models/login-credentials';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private ruta = environment.apiUrl + '/auth/login';

  constructor(private http: HttpClient) {
   }
   
  login(apiLogin: LoginCredentials): Observable<any> {
    const respuesta = Observable<any>;
    console.log(respuesta);
    return this.http.post(this.ruta, apiLogin);
  }
  
}