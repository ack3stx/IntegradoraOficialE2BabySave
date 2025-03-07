import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Usuario} from '../../models/usuario';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CuentasService {

  private ruta = environment.apiUrl + '/todos';
  
  

  constructor(private http:HttpClient) { }

  //Obtener todas las cuentas
   obtenerCuentas() {
    return this.http.get<Usuario[]>(this.ruta).pipe(
      map(users => users.filter(user => user.rol_id !== 3))
    );
  }

  desactivarCuenta(id: number) {
    this.ruta = environment.apiUrl + '/desactivar';
    return this.http.get<any>(`${this.ruta}/${id}`, {});
  }

  activarCuenta(id: number) {
    this.ruta = environment.apiUrl + '/activar';
    return this.http.get<any>(`${this.ruta}/${id}`, {});
  }

}
