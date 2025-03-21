import { Component, inject, OnInit } from '@angular/core';
import { MonitorServiceService } from '../../../core/services/admin/Monitores/monitor-service.service';
import { MonitorModel } from '../../../core/models/monitor.model';
import { PaginadorService } from '../../../core/services/Paginacion/paginador.service';
import { PaginadorComponentComponent } from '../../../shared/paginador-component/paginador-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-monitores',
  imports: [CommonModule, FormsModule, PaginadorComponentComponent],
  templateUrl: './monitores.component.html',
  styleUrl: './monitores.component.css'
})
export class MonitoresComponent implements OnInit {
  
  monitores = inject(MonitorServiceService);
  paginador = inject(PaginadorService);

  Monitor: MonitorModel | MonitorModel[] = [];
  MonitorPaginado : MonitorModel[] = [];

  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 0;
  filtroEstado: string = 'activos';

  ngOnInit(): void {
    this.paginador.paginaActual$.subscribe(() => {
      this.actualizarMonitoresPaginados();
    });
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
    if (Array.isArray(this.Monitor)) {
      this.MonitorPaginado = this.paginador.paginar(this.Monitor);
      this.totalPaginas = this.paginador.calcularTotalPaginas(this.Monitor.length);
    }
  }

  onCambiarPagina(numeroPagina: number): void {
    this.paginador.cambiarPagina(numeroPagina);
  }

}
