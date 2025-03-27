import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginadorComponentComponent } from '../../../../shared/paginador-component/paginador-component.component';
import { MonitorModel } from '../../../../core/models/monitor.model';
import { ReporteMonitoresService } from '../../../../core/services/admin/reporte-gael/reporte-monitores.service';

interface PeriodoAnalisis {
  desde: string;
  hasta: string;
}

interface MonitorAnalisis extends MonitorModel {
  clasificacion: string;
  periodo_analisis: PeriodoAnalisis;
}

interface RespuestaMonitores {
  total_monitores: number;
  periodo_analisis: PeriodoAnalisis;
  monitores: MonitorAnalisis[];
}

@Component({
  selector: 'app-monitores-analisis',
  standalone: true,
  imports: [CommonModule, PaginadorComponentComponent, FormsModule],
  templateUrl: './monitores-analisis.component.html',
  styleUrl: './monitores-analisis.component.css'
})
export class MonitoresAnalisisComponent implements OnInit {
  datosMonitores: RespuestaMonitores | null = null;
  monitoresFiltrados: MonitorAnalisis[] = [];
  monitoresPaginados: MonitorAnalisis[] = [];
  cargando: boolean = true;
  error: string | null = null;
  
  terminoBusqueda: string = '';
  
  paginaActual: number = 1;
  elementosPorPagina: number = 5; 
  totalPaginas: number = 1;

  constructor(private reporteService: ReporteMonitoresService) {}

  ngOnInit(): void {
    this.cargarMonitores();
  }

  cargarMonitores(): void {
    this.cargando = true;
    
    this.reporteService.consultarMonitoresEliminados().subscribe({
      next: (data: RespuestaMonitores) => {
        this.datosMonitores = data;
        this.filtrarMonitores();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar monitores', err);
        this.error = 'No se pudieron cargar los datos de monitores';
        this.cargando = false;
      }
    });
  }

  filtrarMonitores(): void {
    if (!this.datosMonitores) return;

    if (!this.terminoBusqueda) {
      this.monitoresFiltrados = [...this.datosMonitores.monitores];
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.monitoresFiltrados = this.datosMonitores.monitores.filter(monitor => 
        (typeof monitor.user_id === 'string' && monitor.user_id.toString().toLowerCase().includes(termino)) ||
        (monitor.Nombre_Monitor?.toLowerCase().includes(termino)) ||
        (monitor.clasificacion.toLowerCase().includes(termino))
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

  getClasificacionClass(clasificacion: string): string {
    switch (clasificacion) {
      case 'Normal':
        return 'bg-success';
      case 'Precaución':
        return 'bg-warning';
      case 'Peligro':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getNivelActividad(nivel: number | null): string {
    if (nivel === null) return 'No disponible';
    
    if (nivel <= 3) return 'Bajo';
    if (nivel <= 6) return 'Medio';
    return 'Alto';
  }

  getNivelActividadClass(nivel: number | null): string {
    if (nivel === null) return 'bg-secondary';
    
    if (nivel <= 3) return 'bg-success';
    if (nivel <= 6) return 'bg-warning';
    return 'bg-danger';
  }
}