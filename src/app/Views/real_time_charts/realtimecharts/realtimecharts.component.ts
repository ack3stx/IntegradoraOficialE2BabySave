import { Component, OnInit, NgZone,inject } from '@angular/core';
import { RealtimechartsService } from '../../../core/services/real_time_charts/realtimecharts.service';
import { CommonModule } from '@angular/common';
import Pusher from 'pusher-js';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-realtimecharts',
  imports: [CommonModule],
  templateUrl: './realtimecharts.component.html',
  styleUrl: './realtimecharts.component.css'
})
export class RealtimechartsComponent implements OnInit {
  data_sensor: any[] = [];
  selectedSensorId: number | null = null;
  monitorId: number | null = null;
  currentSensorPrefix: string | null = null;
  private router = inject(Router);

  constructor(
    public chartsService: RealtimechartsService,
    private zone: NgZone,
    private route: ActivatedRoute
  ) 
  { 
    this.monitorId = this.route.snapshot.params['id'];  
  }

  private pusher: Pusher | null = null;
  private channel: any = null;

  ngOnInit() {
    Pusher.logToConsole = true;
    this.pusher = new Pusher('f19492c9cd3edadca29d', { cluster: 'us2' });
    this.channel = this.pusher.subscribe('sensor-websocket');

    this.channel.bind('sensor-data', (data: any) => {
      this.zone.run(() => {
        if (this.currentSensorPrefix && this.monitorId) {
          const dataKey = `${this.currentSensorPrefix}${this.monitorId}`;
          if (data.sensordata && data.sensordata[0][dataKey] !== undefined) {
            this.processSensorData(data.sensordata, true);
          }
        }
      });
    });

    this.getSensors();
  }

  onSensorChange(event: any) {
    const sensorId = Number(event.target.value);
    this.selectedSensorId = sensorId;

    const selectedSensor = this.data_sensor.find(s => s.id === sensorId);
    if (!selectedSensor) return;

    this.currentSensorPrefix = selectedSensor.Identificador

    // 🔴 Asegurar que la gráfica anterior se destruya
    this.chartsService.destroyChart();

    // 🔵 Crear nueva gráfica antes de obtener datos
    this.chartsService.createChart();

    // Cancelar la suscripción anterior a Pusher y volver a suscribirse
    if (this.channel) {
      this.channel.unbind('sensor-data');
    }

    this.channel.bind('sensor-data', (data: any) => {
      this.zone.run(() => {
        if (this.currentSensorPrefix && this.monitorId) {
          const dataKey = `${this.currentSensorPrefix}${this.monitorId}`;
          if (data.sensordata && data.sensordata[0][dataKey] !== undefined) {
            this.processSensorData(data.sensordata, true);
          }
        }
      });
    });

    this.loadInitialData();
  }

  private processSensorData(sensorData: any[], isRealtime: boolean = false) {
    if (!sensorData || !this.currentSensorPrefix || !this.monitorId) return;
  
    const dataKey = `${this.currentSensorPrefix}${this.monitorId}`;
    const newLabels: string[] = [];
    const newDataValues: number[] = [];
  
    sensorData.forEach(item => {
      const fecha = item.Fecha;
      const value = item[dataKey];
  
      if (fecha && value !== undefined) {
        // Extraer solo la parte de la hora (después del espacio)
        const hora = fecha.split(' ')[1]; // Esto dividirá "2025-03-21 16:23:14" en ["2025-03-21", "16:23:14"]
        newLabels.push(hora);
        newDataValues.push(parseFloat(value));
      }
    });
  
    const maxPoints = 30;
    
    if (this.chartsService.chart) {
      this.chartsService.chart.data.labels.push(...newLabels.reverse());
      this.chartsService.chart.data.datasets[0].data.push(...newDataValues.reverse());
      
      if (this.chartsService.chart.data.labels.length > maxPoints) {
        this.chartsService.chart.data.labels = this.chartsService.chart.data.labels.slice(-maxPoints);
        this.chartsService.chart.data.datasets[0].data = this.chartsService.chart.data.datasets[0].data.slice(-maxPoints);
      }
      
      this.chartsService.chart.update();
    }
  }

  private loadInitialData() {
    if (!this.currentSensorPrefix || !this.monitorId) return;

    this.chartsService.createChart(); // Crear la nueva gráfica antes de recibir datos

    this.chartsService.getSensorData(this.currentSensorPrefix, this.monitorId)
      .subscribe((response: any) => {
        this.processSensorData(response, false);
      });
  }

  getSensors() {
    const monitorId = this.monitorId;
    if (!monitorId) return;

    this.chartsService.getSensorsMonitor(monitorId).subscribe(
      (response: any) => {
        this.data_sensor = response;
        if (this.data_sensor.length > 0) {
          this.selectedSensorId = this.data_sensor[0].id;
          this.onSensorChange({ target: { value: this.selectedSensorId } });
        }
      },
      error => console.error('Error fetching sensors:', error)
    );
  }

  historicas(monitorId:number | null)
  {
    this.router.navigate(['charts',monitorId]);
  }
}