import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MonitorService } from '../../core/services/monitores/monitor.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitor-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
  monitorForm: FormGroup;
  isEditMode = false;
  monitorId?: number;
  isSubmitting = false; // Para bloquear el botón al enviar
  sensors = [
    { id: 1, name: 'Temperatura', checked: false },
    { id: 4, name: 'Calidad del Aire', checked: false },
    { id: 5, name: 'Nivel de Luz', checked: false },
    { id: 3, name: 'Estado del Bebé', checked: false },
    { id: 2, name: 'Movimiento del Bebé', checked: false }
  ];

  constructor(
    private fb: FormBuilder,
    private monitorService: MonitorService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.monitorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      ubicacion: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.monitorId = +id;
      this.loadMonitor(this.monitorId);
    }
  }

  loadMonitor(id: number): void {
    this.monitorService.getMonitor(id).subscribe(monitor => {
      console.log('Monitor cargado:', monitor);
      this.monitorForm.patchValue({
        nombre: monitor.Nombre_Monitor,
        ubicacion: monitor.Ubicacion
      });
      this.loadSensores(id);
    });
  }

  loadSensores(idMonitor: number): void {
    this.monitorService.getSensoresDeMonitor(idMonitor).subscribe(sensorIds => {
      this.sensors.forEach(sensor => {
        sensor.checked = sensorIds.includes(sensor.id);
      });
    });
  }

  get hasSelectedSensors(): boolean {
    return this.sensors.some(sensor => sensor.checked);
  }

  onSubmit(): void {
    if (this.monitorForm.invalid || (!this.isEditMode && !this.hasSelectedSensors) || this.isSubmitting) return;
    
    this.isSubmitting = true; // Bloquea el botón tras el primer envío
    const monitorData = this.monitorForm.value;

    if (this.isEditMode && this.monitorId) {
      this.monitorService.updateMonitor(this.monitorId, monitorData).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    } else {
      this.monitorService.createMonitor(monitorData).subscribe(response => {
        this.actualizarSensores(response.id);
        this.router.navigate(['/dashboard']);
      });
    }
  }

/*   actualizarSensores(monitorId: number): void {
    this.sensors.filter(s => s.checked).forEach(sensor => {
      this.monitorService.agregarSensor(monitorId, sensor.id).subscribe();
    });
  } */

    actualizarSensores(monitorId: number): void {
      const selectedSensorIds = this.sensors
      .filter(sensor => sensor.checked)     
      .map(sensor => sensor.id);


      this.monitorService.agregarSensor(monitorId, selectedSensorIds).subscribe({
        next: () => {
          console.log("monitor creado")
        },
        error: (err) => {
          console.error('Error al actualizar sensores', err);
        }
      });
    }
}
