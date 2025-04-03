import { Injectable } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SensorData } from '../../models/sensor-data';
import { Observable } from 'rxjs';
import { SensorInterface } from '../../models/sensor.interface';

@Injectable({
  providedIn: 'root'
})
export class ChartsServiceService {
  private apiUrl = environment.apiUrl;
  public chart: Chart | null = null;

  constructor(private http: HttpClient) { }

  obtenerDatosSensor(idSensor: number, sensorSeleccionado: number, fechaLimite: string): Observable<{labels: string[], datos: number[]}> {
    const idMonitor = 1; 
    return this.http.get<SensorData>(`${this.apiUrl}/promedio-hora/${idMonitor}/${idSensor}/${fechaLimite}`).pipe(
      map(response => ({
        labels: Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`),
        datos: response.resultados[0].promedios_por_hora
      }))
    );
  }

  createChart(labels: string[], datos: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: "Sensor",
            data: datos,
            backgroundColor: 'rgba(102, 204, 255, 0.2)',
            borderColor: 'rgb(102, 204, 255)',
            tension: 0.4,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(102, 204, 255)'
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor del Sensor'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Hora'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Datos del Sensor por Hora',
            font: {
              size: 16
            }
          }
        }
      }
    });
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0];
  }
  obtenerSensoresDisponibles(monitorId: number): Observable<SensorInterface[]> {
    return this.http.get<SensorInterface[]>(`${this.apiUrl}/sensores/${monitorId}`).pipe(
      map(response => {
        if (!response) {
          console.error('Respuesta inválida del servidor:', response);
          return [];
        }
        return response;
      })
    );
  }
}