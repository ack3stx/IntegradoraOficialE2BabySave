import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core'; 

@Injectable({
  providedIn: 'root'
})
export class MonitorsDeleteService {

  http = inject(HttpClient);

  private url = environment.apiUrl + '/monitores/eliminados';

  constructor() { 
  }

  consultarMonitoresEliminados(){
    return this.http.get<any>(this.url);
  }

}
