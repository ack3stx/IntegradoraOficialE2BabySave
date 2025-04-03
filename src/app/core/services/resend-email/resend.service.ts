import { Injectable,inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResendE } from '../../models/resend-e';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResendService {

  private reenviourl = environment.apiUrl + '/reenvio';
  constructor(private http:HttpClient) { }

  reenvio(reenviodata: ResendE): Observable<any> {
    return this.http.post(this.reenviourl, reenviodata);
  }
}
