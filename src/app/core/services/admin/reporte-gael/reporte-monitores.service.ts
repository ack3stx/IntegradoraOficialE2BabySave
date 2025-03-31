import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core'; 

@Injectable({
  providedIn: 'root'
})
export class ReporteMonitoresService {

  http = inject(HttpClient);

  private url = environment.apiUrl + '/monitor/actividad';

  constructor() { 
  }

  consultarMonitoresEliminados(){
    return this.http.get<any>(this.url);
  }
}

