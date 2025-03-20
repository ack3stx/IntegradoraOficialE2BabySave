import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonitorModel } from '../../../models/monitor.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitorServiceService {

  ruta = environment.apiUrl;

  constructor(private http: HttpClient) { }

  obtenerMonitoresActivos() {
    this.ruta = environment.apiUrl + '/monitores/activos';
    console.log(this.ruta);
    return this.http.get<MonitorModel[]>(this.ruta);
  }

  obtenerMonitoresInactivos() {
    this.ruta = environment.apiUrl + '/monitores/menos/activos/';
    return this.http.get<MonitorModel[]>(this.ruta);
  }
}
