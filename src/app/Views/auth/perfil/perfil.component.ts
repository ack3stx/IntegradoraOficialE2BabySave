import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../core/models/usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { PerfilService } from '../../../core/services/perfil/perfil.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;
  rolTexto: string = '';
  form: FormGroup;
  editModeName: boolean = false;
  editModePassword: boolean = false;

  constructor(
    private usuarioService: PerfilService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['Cargando...'],
      email: ['Cargando...'], 
      password: ['*********']
    });
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuarioService.getUsuario().subscribe((data: Usuario) => {
      this.usuario = data;

      if (this.usuario.rol_id === 2) {
        this.rolTexto = 'Usuario';
      } else if (this.usuario.rol_id === 3) {
        this.rolTexto = 'Administrador';
      } else {
        this.rolTexto = 'Rol desconocido';
      }

      this.form.patchValue({
        name: this.usuario.name,
        email: this.usuario.email 
      });
    });
  }

  activarEdicionNombre() {
    this.editModeName = !this.editModeName;
    if (!this.editModeName) {
      this.form.patchValue({
        name: this.usuario?.name
      });
    }
  }

  activarEdicionPassword() {
    this.editModePassword = !this.editModePassword;
    if (!this.editModePassword) {
      this.form.patchValue({
        password: '*********'
      });
    } else {
      this.form.patchValue({
        password: ''
      });
    }
  }

  actualizarUsuario() {
    if (this.form.valid) {
      const datosActualizados = {
        name: this.form.value.name,
        password: this.form.value.password
      };

      this.usuarioService.actualizarUsuario(datosActualizados).subscribe(
        (res: any) => {
          this.toastr.success('Usuario actualizado correctamente');
          this.editModeName = false;
          this.editModePassword = false;
          this.cargarUsuario(); 
        },
        (error: any) => {
          this.toastr.error(error.error.msg || 'Falta validar más, dele calma xd');
        }
      );
    }
  }
}