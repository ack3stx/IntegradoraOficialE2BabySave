import { Component, inject, OnInit } from '@angular/core';
import { MonitorServiceService } from '../../../core/services/admin/Monitores/monitor-service.service';
import { MonitorModel } from '../../../core/models/monitor.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitores',
  imports: [CommonModule, FormsModule],
  templateUrl: './monitores.component.html',
  styleUrl: './monitores.component.css'
})
export class MonitoresComponent implements OnInit {
  
  monitores = inject(MonitorServiceService);

  Monitor: MonitorModel | MonitorModel[] = [];
  MonitorPaginado : MonitorModel[] = [];

  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  filtroEstado: string = 'activos';

  ngOnInit(): void {
   this.getMonitores();
  }

  getMonitores() {
    console.log('Filtro actual:', this.filtroEstado); // Debug

    let peticion;
    if (this.filtroEstado === 'activos') {
      peticion = this.monitores.obtenerMonitoresActivos();
    } else {
      peticion = this.monitores.obtenerMonitoresInactivos();
    }

    peticion.subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // Debug
        this.Monitor = data;
        this.calcularTotalPaginas();
        this.actualizarMonitoresPaginados();
      },
      error: (error) => {
        console.error('Error al cargar monitores:', error);
      }
    });
  }

  onFiltroChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroEstado = select.value;
    console.log('Nuevo filtro seleccionado:', this.filtroEstado); // Debug
    this.paginaActual = 1;
    this.Monitor = []; // Limpiamos los datos anteriores
    this.MonitorPaginado = []; // Limpiamos la paginación
    this.getMonitores();
  }

  calcularTotalPaginas(): void {
    this.totalPaginas = Array.isArray(this.Monitor) ? Math.ceil(this.Monitor.length / this.elementosPorPagina) : 0;
  }

  actualizarMonitoresPaginados(): void {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.MonitorPaginado = Array.isArray(this.Monitor) ? this.Monitor.slice(inicio, fin) : [];
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      this.actualizarMonitoresPaginados();
    }
  }

}
