import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimechartsService {

  private apiUrl = environment.apiUrl + '/sensor-data';

  public chart: any;
  constructor(private http:HttpClient) { }

  createChart() {
      this.chart = new Chart("MyChart", {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    getSensorData(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }
}
