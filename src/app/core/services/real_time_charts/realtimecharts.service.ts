import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RealtimechartsService {
  private apiUrl = environment.apiUrl + '/sensor-data/1';
  public chart: any;

  constructor(private http: HttpClient) { }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: [], // Aquí se almacenarán las fechas (created_at)
        datasets: [{
          label: "Valor del Sensor",
          data: [], // Aquí se almacenarán los valores numéricos (valor)
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  // Método para actualizar los datos del gráfico
  updateChartData(labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update(); // Actualiza el gráfico
    }
  }

  getSensorData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Método para actualizar el apiUrl
  updateApiUrl(sensorId: number) {
    this.apiUrl = `${environment.apiUrl}/sensor-data/${sensorId}`;
  }

  getSensors(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/sensores`);
  }
}