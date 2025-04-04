import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonitorModel } from '../../models/monitor.model';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {
  private url = environment.apiUrl + '/monitores';
  private datos = environment.apiUrl + '/datos-mongo';
  router = inject(Router)

  constructor(private http: HttpClient) {}

  getMonitores(): Observable<MonitorModel[]> {
    return this.http.get<MonitorModel[]>(this.url);
  }

  getMonitor(id: number): Observable<MonitorModel> {
    return this.http.get<MonitorModel>(`${environment.apiUrl}/monitores/${id}`);
  }

  createMonitor(monitor: MonitorModel): Observable<MonitorModel> {
    return this.http.post<MonitorModel>(`${environment.apiUrl}/monitor`, monitor);
  }

  updateMonitor(id: number, monitor: MonitorModel): Observable<MonitorModel> {
    return this.http.put<MonitorModel>(`${environment.apiUrl}/monitor/${id}`, monitor);
  }

  deleteMonitor(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/monitor/${id}`);
  }

  getSensoresDeMonitor(idMonitor: number): Observable<number[]> {
    return this.http.get<number[]>(`${environment.apiUrl}/sensores/${idMonitor}`);
  }

  /* agregarSensor(idMonitor: number, idSensor: number): Observable<void> {
    return this.http.get<void>(`${environment.apiUrl}/sensor/${idMonitor}/${idSensor}`);
  } */

    
    agregarSensor(idMonitor: number,sensores:number[]): Observable<void> {
      return this.http.post<void>(`${environment.apiUrl}/sensor/${idMonitor}`,{sensores});
    } 

  //DATOS DEL MONITOR QUE ESCOGIO A MONGO
  datosMongo(idMonitor: number): Observable<any> {
    return this.http.get<any>(`${this.datos}/${idMonitor}`);
  }
}
