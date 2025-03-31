import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MonitorsDeleteService } from '../../../core/services/admin/deletes-monitors/monitors-delete.service';
import { MonitorModel } from '../../../core/models/monitor.model';
import { PaginadorComponentComponent } from '../../../shared/paginador-component/paginador-component.component';

@Component({
  selector: 'app-delete-monitors',
  standalone: true,
  imports: [CommonModule, PaginadorComponentComponent, FormsModule],
  templateUrl: './delete-monitors.component.html',
  styleUrl: './delete-monitors.component.css'
})
export class DeleteMonitorsComponent implements OnInit {
  monitores: MonitorModel[] = [];
  monitoresFiltrados: MonitorModel[] = [];
  monitoresPaginados: MonitorModel[] = [];
  cargando: boolean = true;
  error: string | null = null;
  
  terminoBusqueda: string = '';
  
  paginaActual: number = 1;
  elementosPorPagina: number = 5; 
  totalPaginas: number = 1;

  constructor(private monitorsDeleteService: MonitorsDeleteService) {}

  ngOnInit(): void {
    this.cargarMonitores();
  }

  cargarMonitores(): void {
    this.cargando = true;
    this.monitorsDeleteService.consultarMonitoresEliminados().subscribe({
      next: (data) => {
        this.monitores = data;
        this.filtrarMonitores();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar monitores eliminados', err);
        this.error = 'No se pudieron cargar los monitores eliminados';
        this.cargando = false;
      }
    });
  }

  filtrarMonitores(): void {
    if (!this.terminoBusqueda) {
      this.monitoresFiltrados = [...this.monitores];
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.monitoresFiltrados = this.monitores.filter(monitor => 
        (monitor.Nombre_Monitor?.toLowerCase().includes(termino) || 
         monitor.Ubicacion.toLowerCase().includes(termino))
      );
    }
    
    this.totalPaginas = Math.ceil(this.monitoresFiltrados.length / this.elementosPorPagina);
    this.paginaActual = 1;
    this.aplicarPaginacion();
  }

  buscarMonitores(): void {
    this.filtrarMonitores();
  }

  aplicarPaginacion(): void {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.monitoresPaginados = this.monitoresFiltrados.slice(inicio, fin);
  }

  cambiarPagina(numeroPagina: number): void {
    this.paginaActual = numeroPagina;
    this.aplicarPaginacion();
  }

  formatearFecha(fecha: string | null | undefined): string {
    if (!fecha) return 'No disponible';
    
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}