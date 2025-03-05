import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MonitorModel } from '../../models/monitor.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitorService {

  private url = environment.apiUrl + '/monitores';
  constructor(private http:HttpClient) { }

  getMonitores():Observable<MonitorModel[]>
  {
    return this.http.get<MonitorModel[]>(this.url);
  }
}
