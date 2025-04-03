import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment} from '../../../../environments/environment';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class StatusbocinaService {

  private baseUrl = environment.apiUrl;
   private pusher: Pusher | null = null;
    private channel: any = null;
     private estado = new Subject<any>();

  constructor(private http:HttpClient) {
        Pusher.logToConsole = true;
        this.pusher = new Pusher('f19492c9cd3edadca29d', { cluster: 'us2' });
        this.channel = this.pusher.subscribe('estado-websocket');

        this.channel.bind('estado-bocina', (data: any) => {
          console.log('Mensaje recibido:', data);
          this.estado.next(data)
    
        });
        
    
        
   }


   getStatus() 
   {
    return this.estado.asObservable();
   }  

  apagarBocina(estado:number): Observable<any> 
  {
      return this.http.post<any>(`${environment.apiUrl}/bocina/estado`, estado);
  }
}
