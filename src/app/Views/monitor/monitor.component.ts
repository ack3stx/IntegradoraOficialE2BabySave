import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-monitor-creator',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent {
  monitorForm: FormGroup;
  sensors = [
    { name: 'Temperatura', value: 'temperatura', checked: false },
    { name: 'Calidad del Aire', value: 'calidadAire', checked: false },
    { name: 'Nivel de Luz', value: 'nivelLuz', checked: false },
    { name: 'Estado del Bebé', value: 'estadoBebe', checked: false },
    { name: 'Movimiento del Bebé', value: 'movimientoBebe', checked: false }
  ];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.monitorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      ubicacion: ['']
    });
  }

  crearMonitor() {
    if (this.monitorForm.invalid) return;
    const monitorData = this.monitorForm.value;
    const token = localStorage.getItem('token');
  
    this.http.post<{ id: number; nombre: string }>(
      environment.apiUrl + '/monitor',
      monitorData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    ).subscribe(response => {
        console.log('Monitor creado:', response);
        this.agregarSensores(response.id);
      }, error => {
        console.error('Error al crear el monitor', error);
      });
  }
  

  agregarSensores(monitorId: number) {
    const token = localStorage.getItem('token');
  
    this.sensors.filter(s => s.checked).forEach(sensor => {
      this.http.post(
        environment.apiUrl + '/sensor/agregar',
        { monitorId, sensor: sensor.value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      ).subscribe(() => {
          console.log(`Sensor ${sensor.name} agregado al monitor ${monitorId}`);
        }, error => {
          console.error(`Error al agregar sensor ${sensor.name}`, error);
        });
    });
  }
  
}

bootstrapApplication(MonitorComponent);
