import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Usuario } from '../../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private url = environment.apiUrl + '/auth/me';  
  private updateUrl = environment.apiUrl + '/actualizar/usuario';

  constructor(private http: HttpClient) { }

  getUsuario(): Observable<Usuario> {
    return this.http.get<Usuario>(this.url);
  }

  actualizarUsuario(data: any): Observable<any> {
    return this.http.put<any>(this.updateUrl, data);
  }
}
