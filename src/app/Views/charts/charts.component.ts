import { Component, inject, OnInit } from '@angular/core';
import { ChartsServiceService } from '../../core/services/charts/charts-service.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {
  charts = inject(ChartsServiceService); 
  sensorSeleccionado: number = 1; 


  ngOnInit(): void {
    console.log('Sensor inicial:', this.sensorSeleccionado);
    this.cargarDatosSensor();
  }

  onSensorChange(event: any): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sensorSeleccionado = parseInt(selectElement.value);
    this.cargarDatosSensor();
  }

  cargarDatosSensor(): void {
    const fechaActual = this.charts.obtenerFechaActual();
    console.log('sesor seleccionado:', this.sensorSeleccionado);
    this.charts.obtenerDatosSensor(this.sensorSeleccionado, fechaActual)
      .subscribe({
        next: (data) => {
         
          this.charts.createChart(data.labels, data.datos);
        },
        error: (error) => {
          console.error('Error al cargar datos del sensor:', error);
        }
      });
  }

  

 


}
