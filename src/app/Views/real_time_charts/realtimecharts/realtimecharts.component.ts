import { Component, OnInit, NgZone, inject } from '@angular/core';
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
  buttonText: string = 'Gráficas Históricas'; // Texto inicial del botón
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
        // Solo procesar datos si hay un sensor seleccionado y el monitor ID coincide
        if (this.currentSensorPrefix && this.monitorId) {
          const sensorData = data.sensordata;
          const dataKey = `${this.currentSensorPrefix}${this.monitorId}`;
          
          // Solo procesar si es el sensor seleccionado y el monitor correcto
          if (sensorData[dataKey] !== undefined && 
              (!sensorData.id_monitor || sensorData.id_monitor.toString() === this.monitorId.toString())) {
            
            const fecha = sensorData.Fecha;
            const value = sensorData[dataKey];
            
            if (fecha && value !== undefined) {
              const hora = fecha.split(' ')[1];
              console.log(`Actualizando gráfica de ${dataKey} con valor: ${value} a las ${hora}`);
              this.updateChartWithNewPoint(hora, parseFloat(value));
            }
          }
        }
      });
    });
  
    this.getSensors();
    this.updateButtonText(); // Llama a la función para actualizar el texto del botón
  }
  
  // Nueva función para actualizar el texto del botón dinámicamente
  private updateButtonText() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('charts')) {
      this.buttonText = 'Regresar a Gráficas en Vivo';
    } else {
      this.buttonText = 'Gráficas Históricas';
    }
  }
  
  // Modifica la acción del botón para cambiar entre rutas
  toggleCharts() {
    const currentRoute = this.router.url;
    if (currentRoute.includes('charts')) {
      this.router.navigate(['/live', this.monitorId]); // Navega a 'live' con el id del monitor
    } else {
      this.router.navigate(['/charts', this.monitorId]); // Navega a 'charts' con el id del monitor
    }
  }

  ngOnDestroy() {
    console.log('Componente RealtimechartsComponent destruido - limpiando recursos Pusher');
    
    // Desuscribirse del canal específico
    if (this.channel) {
      this.channel.unbind_all(); // Quitar todos los event listeners
      if (this.pusher) {
        this.pusher.unsubscribe('sensor-websocket');
      }
    }
    
    // Desconectar Pusher completamente
    if (this.pusher) {
      this.pusher.disconnect();
      this.pusher = null;
    }
    
    // Destruir el gráfico para liberar recursos
    this.chartsService.destroyChart();
  }

  onSensorChange(event: any) {
    const sensorId = Number(event.target.value);
    this.selectedSensorId = sensorId;

    const selectedSensor = this.data_sensor.find(s => s.id === sensorId);
    if (!selectedSensor) return;

    this.currentSensorPrefix = selectedSensor.Identificador;

    // 🔴 Destroy previous chart
    this.chartsService.destroyChart();

    // 🔵 Create new chart before getting data
    this.chartsService.createChart();

    // Actualizar el título del gráfico con el tipo de sensor actual
    if (this.chartsService.chart) {
      this.chartsService.chart.data.datasets[0].label = `Sensor ${this.currentSensorPrefix}${this.monitorId}`;
      this.chartsService.chart.update();
    }

    // No es necesario volver a vincular el evento Pusher,
    // ya que el filtrado del sensor se hace en processRealtimeSensorData

    this.loadInitialData();
  }

  // Procesar datos en tiempo real desde Pusher
  private processRealtimeSensorData(sensorData: any) {
    if (!this.currentSensorPrefix || !this.monitorId) return;
  
    const dataKey = `${this.currentSensorPrefix}${this.monitorId}`;
    
    // IMPORTANTE: Verificar que sensorData contiene nuestro sensor específico
    // y que el monitor ID coincide con el monitor seleccionado
    if (sensorData[dataKey] === undefined || 
        (sensorData.id_monitor && sensorData.id_monitor.toString() !== this.monitorId.toString())) {
      // Si los datos no son para nuestro sensor o monitor, ignorarlos
      return;
    }
    
    // Verificar que el prefijo del sensor actual coincide con el sensor que estamos escuchando
    // Este es el cambio clave para arreglar el problema
    const currentSensorType = this.currentSensorPrefix;
    const sensorPrefixInData = dataKey.replace(this.monitorId.toString(), '');
    
    if (sensorPrefixInData !== currentSensorType) {
      // Si los datos recibidos no son para el sensor seleccionado, ignorarlos
      return;
    }
    
    const fecha = sensorData.Fecha;
    const value = sensorData[dataKey];
    
    if (fecha && value !== undefined) {
      // Extraer solo la parte de la hora (después del espacio)
      const hora = fecha.split(' ')[1]; // Divide "2025-03-21 16:23:14" en ["2025-03-21", "16:23:14"]
      
      console.log(`Actualizando gráfica de ${dataKey} con valor: ${value} a las ${hora}`);
      
      // Actualizar el gráfico con el nuevo punto de datos
      this.updateChartWithNewPoint(hora, parseFloat(value));
    }
  }

  // Método auxiliar para añadir un nuevo punto al gráfico
  private updateChartWithNewPoint(label: string, value: number) {
    if (!this.chartsService.chart) return;
    
    const maxPoints = 30;
    
    // Añadir el nuevo punto al final (más reciente)
    this.chartsService.chart.data.labels.push(label);
    this.chartsService.chart.data.datasets[0].data.push(value);
    
    // Mantener solo los últimos maxPoints
    if (this.chartsService.chart.data.labels.length > maxPoints) {
      this.chartsService.chart.data.labels = this.chartsService.chart.data.labels.slice(-maxPoints);
      this.chartsService.chart.data.datasets[0].data = this.chartsService.chart.data.datasets[0].data.slice(-maxPoints);
    }
    
    // Actualizar el gráfico
    this.chartsService.chart.update();
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
        const hora = fecha.split(' ')[1];
        newLabels.push(hora);
        newDataValues.push(parseFloat(value));
      }
    });
  
    const maxPoints = 30;
    
    if (this.chartsService.chart) {
      // Actualizar el título del gráfico
      this.chartsService.chart.data.datasets[0].label = `Sensor ${dataKey}`;
      
      // Añadir nuevos puntos de datos al final de los arrays (puntos de datos más antiguos)
      this.chartsService.chart.data.labels.push(...newLabels.reverse());
      this.chartsService.chart.data.datasets[0].data.push(...newDataValues.reverse());
      
      // Mantener solo los últimos maxPoints
      if (this.chartsService.chart.data.labels.length > maxPoints) {
        this.chartsService.chart.data.labels = this.chartsService.chart.data.labels.slice(-maxPoints);
        this.chartsService.chart.data.datasets[0].data = this.chartsService.chart.data.datasets[0].data.slice(-maxPoints);
      }
      
      this.chartsService.chart.update();
    }
  }

  private loadInitialData() {
    if (!this.currentSensorPrefix || !this.monitorId) return;

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

  historicas(monitorId: number | null) {
    this.router.navigate(['charts', monitorId]);
  }
}