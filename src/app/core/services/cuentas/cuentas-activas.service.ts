import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Usuario} from '../../models/usuario';
@Injectable({
  providedIn: 'root'
})
export class CuentasActivasService {

  private ruta = environment.apiUrl + '/activos';

  constructor(private http:HttpClient) { }

  obtenerCuentasActivas(){
    return this.http.get<Usuario>(this.ruta);
  } 


}
