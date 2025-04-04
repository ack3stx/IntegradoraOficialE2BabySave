import { Component, inject, OnInit } from '@angular/core';
import { ChartsServiceService } from '../../core/services/charts/charts-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SensorInterface } from '../../core/models/sensor.interface';
import { Router } from '@angular/router';
import { MonitorService } from '../../core/services/monitores/monitor.service';
import { ActivatedRoute } from '@angular/router'; // Importa ActivatedRoute
import { MonitorModel } from '../../core/models/monitor.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent implements OnInit {
  charts = inject(ChartsServiceService);
  monitorId: number = 1; // Valor inicial, se actualizará con el id de la ruta
  sensorSeleccionado: number = 0;
  fechaSeleccionada: string | undefined;
  fechasDisponibles: string[] = [];
  sensoresDisponibles: SensorInterface[] = [];
  buttonText: string = 'Regresar a Gráficas en Vivo'; 
  private router = inject(Router); // Inyecta el Router
  private route = inject(ActivatedRoute);
  isMonitorValid: boolean = false; // Nueva bandera para validar el monitor
  noDataMessage: string = '';  // Inyecta ActivatedRoute
 private monitorService = inject(MonitorService);
 private toastr = inject(ToastrService) // Inyecta el servicio de monitores

  ngOnInit(): void {
    // Obtén el id del monitor desde la ruta
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.monitorId = +id; // Asigna el id al monitorId
    }
    this.monitoresUsuario()
  }

  // Método para regresar a las gráficas en vivo
  regresarAGraficasEnVivo(): void {
    this.router.navigate(['/live', this.monitorId]); // Navega a 'live' con el id del monitor
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
    this.fechasDisponibles = Array.from({ length: 5 }, (_, i) => {
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

  monitoresUsuario() {
      this.monitorService.getMonitores().subscribe(
        (monitores: MonitorModel[]) => {
          const monitorIds = monitores.map(monitor => monitor.id);
          //console.log('IDs de los monitores del usuario:', monitorIds);
  
          const monitorIdNumber = Number(this.monitorId);
  
          // Validar si el monitorId actual está en la lista de IDs
          if (monitorIdNumber && monitorIds.includes(monitorIdNumber)) {
            this.isMonitorValid = true; // El monitor es válido
            //console.log('El monitor ID es válido:', this.monitorId);
            this.generarUltimas5Fechas();
            this.fechaSeleccionada = this.fechasDisponibles[0];
            console.log('Sensor inicial:', this.sensorSeleccionado);
            this.cargarDatosSensor();
            this.cargarSensoresDisponibles();
            // Cargar datos solo si el monitor es válido
            
          } else {
            this.isMonitorValid = false; // El monitor no es válido
            this.noDataMessage = 'No hay información disponible'; // Mostrar mensaje
            this.toastr.error('Monitor inválido', 'Error');
            // console.error('El monitor ID no es válido:', this.monitorId);
          }
        },
        error => {
          console.error('Error al obtener los monitores del usuario:', error);
          this.noDataMessage = 'No hay información disponible'; // Mostrar mensaje en caso de error
        }
      );
    }
}