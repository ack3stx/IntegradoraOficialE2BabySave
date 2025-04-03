import { Component, inject, OnInit } from '@angular/core';
import { ChartsServiceService } from '../../core/services/charts/charts-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SensorInterface } from '../../core/models/sensor.interface';


@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {
  charts = inject(ChartsServiceService);
  monitorId: number = 1; 
  sensorSeleccionado: number = 0; 
  fechaSeleccionada: string | undefined;
  fechasDisponibles: string[] = [];
  sensoresDisponibles: SensorInterface[] = [];

  ngOnInit(): void {
    this.generarUltimas5Fechas();
   
    this.fechaSeleccionada = this.fechasDisponibles[0];
    console.log('Sensor inicial:', this.sensorSeleccionado);
    console.log('Sensor inicial:', this.sensorSeleccionado);
    this.cargarDatosSensor();
    this.cargarSensoresDisponibles();
  }

  cargarSensoresDisponibles(): void {
    this.charts.obtenerSensoresDisponibles(this.monitorId).subscribe({
      next: (sensores: SensorInterface[]) => {
        console.log('Sensores recibidos:', sensores);
        this.sensoresDisponibles = sensores;
        if (this.sensoresDisponibles.length > 0) {
          this.sensorSeleccionado = this.sensoresDisponibles[0].id;
          this.cargarDatosSensor();
        }
      },
      error: (error) => {
        console.error('Error al cargar sensores:', error);
        this.sensoresDisponibles = [];
      }
    });
  }

  generarUltimas5Fechas(): void {
    const hoy = new Date();
    this.fechasDisponibles = Array.from({length: 5}, (_, i) => {
      const fecha = new Date();
      fecha.setDate(hoy.getDate() - i);
      return fecha.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    });
  }

  onFechaChange(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    this.fechaSeleccionada = selectElement.value;
    this.cargarDatosSensor();
  }
  

  onSensorChange(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sensorSeleccionado = parseInt(selectElement.value);
    this.cargarDatosSensor();
  }


  cargarDatosSensor(): void {
    console.log('sensor seleccionado:', this.sensorSeleccionado);
    this.charts.obtenerDatosSensor(
      this.monitorId, 
      this.sensorSeleccionado, 
      this.fechaSeleccionada || ''
    ).subscribe({
      next: (data) => {
        console.log('Datos del sensor:', data);
        this.charts.createChart(data.labels, data.datos);
      },
      error: (error) => {
        console.error('Error al cargar datos del sensor:', error);
      }
    });
  }

  

 


}
