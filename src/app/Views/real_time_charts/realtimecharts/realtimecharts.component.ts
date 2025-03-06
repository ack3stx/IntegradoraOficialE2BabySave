import { Component, OnInit, NgZone } from '@angular/core';
import { RealtimechartsService } from '../../../core/services/real_time_charts/realtimecharts.service';
import { CommonModule } from '@angular/common';
import Pusher from 'pusher-js';

@Component({
  selector: 'app-realtimecharts',
  imports: [CommonModule],
  templateUrl: './realtimecharts.component.html',
  styleUrl: './realtimecharts.component.css'
})
export class RealtimechartsComponent implements OnInit {
  data_sensor: any[] = [];
  selectedSensorId: number | null = null; // Propiedad para almacenar el ID del sensor seleccionado

  constructor(
    public chartsService: RealtimechartsService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    // Configurar Pusher para actualización en tiempo real
    Pusher.logToConsole = true;
    const pusher = new Pusher('f19492c9cd3edadca29d', { cluster: 'us2' });
    const channel = pusher.subscribe('sensor-websocket');

    // Escuchar eventos del websocket
    channel.bind('sensor-data', (data: any) => {
      this.zone.run(() => {
        // Verificar si los datos recibidos corresponden al sensor seleccionado
        if (data.sensordata.length > 0 && data.sensordata[0].sensor_id === this.selectedSensorId) {
          this.processSensorData(data.sensordata);
        }
      });
    });

    // Obtener datos iniciales y crear gráfico
    this.loadInitialData();

    // Simular la selección del primer sensor
    this.onSensorChange({ target: { value: '1' } });
  }

  private processSensorData(sensorData: any[]) {
    if (!sensorData || !Array.isArray(sensorData)) return;

    const reversedData = [...sensorData].reverse();

    // Formatear las fechas
    const labels = reversedData.map(item => {
      const date = new Date(item.created_at);
      return this.formatDate(date); // Usar función de formateo
    });

    const dataValues = reversedData.map(item => parseInt(item.valor, 10));
    this.chartsService.updateChartData(labels, dataValues);
  }

  // Función para formatear la fecha
  private formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // Método modificado para crear el gráfico antes de obtener los datos
  private loadInitialData() {
    this.chartsService.createChart(); // Crear el gráfico primero
    this.chartsService.getSensorData().subscribe((response: any) => {
      this.processSensorData(response.sensordata);
    });
  }

  // Método para manejar el cambio de selección del sensor
  onSensorChange(event: any) {
    const sensorId = event.target.value;
    this.selectedSensorId = sensorId; // Actualizar el ID del sensor seleccionado
    this.chartsService.chart.destroy(); // Destruir el gráfico actual
    this.chartsService.updateApiUrl(sensorId);
    this.loadInitialData(); // Cargar datos del nuevo sensor
  }
}