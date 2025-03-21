import { CommonModule } from '@angular/common';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-paginador-component',
  imports: [CommonModule],
  templateUrl: './paginador-component.component.html',
  styleUrl: './paginador-component.component.css'
})
export class PaginadorComponentComponent {

  @Input() paginaActual: number = 1;
  @Input() totalPaginas: number = 1;
  @Output() cambiarPaginaEvent = new EventEmitter<number>();

  cambiarPagina(numeroPagina: number): void {
    if (numeroPagina >= 1 && numeroPagina <= this.totalPaginas) {
      this.cambiarPaginaEvent.emit(numeroPagina);
    }
  }


}
