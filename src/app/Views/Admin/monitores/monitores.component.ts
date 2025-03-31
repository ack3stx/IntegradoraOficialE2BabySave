import { Component, inject, OnInit } from '@angular/core';
import { MonitorServiceService } from '../../../core/services/admin/Monitores/monitor-service.service';
import { MonitorModel } from '../../../core/models/monitor.model';
import { PaginadorService } from '../../../core/services/Paginacion/paginador.service';
import { PaginadorComponentComponent } from '../../../shared/paginador-component/paginador-component.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FindComponent } from '../../../shared/find/find.component';

@Component({
  selector: 'app-monitores',
  imports: [CommonModule, FormsModule, PaginadorComponentComponent, FindComponent],
  templateUrl: './monitores.component.html',
  styleUrl: './monitores.component.css'
})
export class MonitoresComponent implements OnInit {
  
  monitores = inject(MonitorServiceService);
  paginador = inject(PaginadorService);
  

  Monitor: MonitorModel | MonitorModel[] = [];
  MonitorPaginado : MonitorModel[] = [];
  terminoBusqueda: string = '';
  monitoresFiltrados: MonitorModel[] = [];

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

  buscarMonitores(termino: string): void {
    this.terminoBusqueda = termino.toLowerCase();
    
    if (Array.isArray(this.Monitor)) {
      this.monitoresFiltrados = this.Monitor.filter(monitor => 
        monitor.Nombre_Monitor?.toLowerCase().includes(this.terminoBusqueda) ?? false
      );
      
      this.MonitorPaginado = this.paginador.paginar(this.monitoresFiltrados);
      this.totalPaginas = this.paginador.calcularTotalPaginas(this.monitoresFiltrados.length);
    }
  }

  getMonitores() {
    console.log('Filtro actual:', this.filtroEstado);

    let peticion;
    if (this.filtroEstado === 'activos') {
      peticion = this.monitores.obtenerMonitoresActivos();
    } else {
      peticion = this.monitores.obtenerMonitoresInactivos();
    }

    peticion.subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.Monitor = data;
        this.monitoresFiltrados = data; // Inicializamos los monitores filtrados
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
    console.log('Nuevo filtro seleccionado:', this.filtroEstado);
    this.paginaActual = 1;
    this.Monitor = [];
    this.MonitorPaginado = [];
    this.monitoresFiltrados = []; // Limpiamos también los filtrados
    this.terminoBusqueda = ''; // Reseteamos la búsqueda
    this.getMonitores();
  }

  calcularTotalPaginas(): void {
    this.totalPaginas = Array.isArray(this.Monitor) ? Math.ceil(this.Monitor.length / this.elementosPorPagina) : 0;
  }

  actualizarMonitoresPaginados(): void {
    if (Array.isArray(this.Monitor)) {
      // Usamos monitoresFiltrados en lugar de Monitor para la paginación
      const datosAPaginar = this.terminoBusqueda ? this.monitoresFiltrados : this.Monitor;
      this.MonitorPaginado = this.paginador.paginar(datosAPaginar);
      this.totalPaginas = this.paginador.calcularTotalPaginas(datosAPaginar.length);
    }
  }

  onCambiarPagina(numeroPagina: number): void {
    this.paginador.cambiarPagina(numeroPagina);
  }

}
