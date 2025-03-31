import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimechartsService {
  private baseUrl = environment.apiUrl; // URL base sin endpoint específico
  public chart: any;

  constructor(private http: HttpClient) { }

  public destroyChart() {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  createChart() {
    if (this.chart) {
      return;
    }

    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: "Valor del Sensor",
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  updateChartData(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    }
  }

  getSensorData(sensorType: string, monitorId: number): Observable<any> {
    const body = {
      sensor: sensorType,
      id_monitor: monitorId.toString()
    };
    return this.http.post<any>(`${this.baseUrl}/data-sensor`, body);
  }

  getSensorsMonitor(monitorId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/sensores/${monitorId}`);
  }
}