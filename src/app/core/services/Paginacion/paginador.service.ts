import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginadorService {
  private elementosPorPagina = 5;
  private paginaActual = new BehaviorSubject<number>(1);
  paginaActual$ = this.paginaActual.asObservable();

  calcularTotalPaginas(totalElementos: number): number {
    return Math.ceil(totalElementos / this.elementosPorPagina);
  }

  paginar<T>(datos: T[]): T[] {
    const inicio = (this.paginaActual.value - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return datos.slice(inicio, fin);
  }

  cambiarPagina(numeroPagina: number): void {
    this.paginaActual.next(numeroPagina);
  }

  obtenerPaginaActual(): number {
    return this.paginaActual.value;
  }

  obtenerElementosPorPagina(): number {
    return this.elementosPorPagina;
  }
}