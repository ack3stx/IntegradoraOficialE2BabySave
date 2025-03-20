import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MonitorModel } from '../../../models/monitor.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitorServiceService {

  ruta = environment.apiUrl + '/monitores/activos';

  constructor(private http: HttpClient) { }

  obtenerMonitores() {
    return this.http.get<MonitorModel[]>(this.ruta);
  }
}
