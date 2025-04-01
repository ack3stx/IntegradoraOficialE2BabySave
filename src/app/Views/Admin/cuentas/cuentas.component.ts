import { Component, inject, OnInit } from '@angular/core';
import { CuentasService } from '../../../core/services/admin/cuentas/cuentas.service';
import { Usuario } from '../../../core/models/usuario';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import * as bootstrap from 'bootstrap';
import { FindComponent } from '../../../shared/find/find.component';


@Component({
  selector: 'app-cuentas',
  imports: [CommonModule, FormsModule,FindComponent],
  templateUrl: './cuentas.component.html',
  styleUrl: './cuentas.component.css'
})
export class CuentasComponent implements OnInit {

  usuarioSeleccionado: any = null;
  terminoBusqueda: string = '';
  usuariosFiltradosBusqueda: Usuario[] = [];

  seleccionarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
  }

  onConfirmarCambioEstado() {
    if (this.usuarioSeleccionado) {
      this.cambiarEstado(this.usuarioSeleccionado);
      this.cerrarModal();
    }
  }

  buscarUsuarios(termino: string): void {
    this.terminoBusqueda = termino.toLowerCase();
    
    this.usuariosFiltradosBusqueda = this.users.filter(usuario => 
      usuario.name.toLowerCase().includes(this.terminoBusqueda) ||
      usuario.email.toLowerCase().includes(this.terminoBusqueda)
    );
  }

  get usuariosFiltrados(): Usuario[] {
    let usuariosFiltrados = this.terminoBusqueda ? this.usuariosFiltradosBusqueda : this.users;

    if (this.filtroEstado === 'activos') {
      return usuariosFiltrados.filter(usuario => usuario.cuenta_activa === 1);
    } else if (this.filtroEstado === 'inactivos') {
      return usuariosFiltrados.filter(usuario => usuario.cuenta_activa === 0);
    }
    return usuariosFiltrados;
  }

  cerrarModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance?.hide();
    }
    this.usuarioSeleccionado = null;
  }
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
