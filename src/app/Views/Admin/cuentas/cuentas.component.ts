import { Component, inject, OnInit } from '@angular/core';
import { CuentasService } from '../../../core/services/cuentas/cuentas.service';
import { Usuario } from '../../../core/models/usuario';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-cuentas',
  imports: [CommonModule, FormsModule],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent implements OnInit {

  users: Usuario[] = [];

  filtroEstado: string = 'todos';


  usuarios = inject(CuentasService);
  
 
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarios.obtenerCuentas().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  cambiarEstado(usuario: Usuario) {
  if (usuario.cuenta_activa == 1) {
    this.usuarios.desactivarCuenta(usuario.id).subscribe({
      next: () => {
        usuario.cuenta_activa = usuario.cuenta_activa ? 0 : 1;
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
      }
    });
   }
   else{
    this.usuarios.activarCuenta(usuario.id).subscribe({
      next: () => {
        usuario.cuenta_activa = usuario.cuenta_activa ? 0 : 1;
        this.cargarUsuarios();
      },
      error: (error) => {
        console.error('Error al cambiar estado:', error);
      }
    });
   }
  }

  get usuariosFiltrados(): Usuario[] {
    if (this.filtroEstado === 'activos') {
      return this.users.filter(usuario => usuario.cuenta_activa === 1);
    } else if (this.filtroEstado === 'inactivos') {
      return this.users.filter(usuario => usuario.cuenta_activa === 0);
    }
    return this.users;
  }

  paginaActual: number = 1;
  itemsPorPagina: number = 5;
  
  get usuariosFiltradosPaginados(): Usuario[] {
    const indexInicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const indexFin = indexInicio + this.itemsPorPagina;
    return this.usuariosFiltrados.slice(indexInicio, indexFin);
  }

  get totalPaginas(): number {
    return Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }


  

}
