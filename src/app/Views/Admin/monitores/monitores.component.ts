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

  ngOnInit(): void {
   this.getMonitores();
  }

  getMonitores() {
    this.monitores.obtenerMonitores().subscribe({
      next: (data) => {
        this.Monitor = data;
        this.calcularTotalPaginas();
        this.actualizarMonitoresPaginados();
      },
      error: (error) => {
        console.error('Error al cargar monitores:', error);
      }
    });
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
