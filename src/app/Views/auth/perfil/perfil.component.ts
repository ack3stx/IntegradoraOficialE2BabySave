import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../core/models/usuario';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Validators } from '@angular/forms';
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
  showPassword: boolean = false;
  private passwordOriginal: string = '*********';

  constructor(
    private usuarioService: PerfilService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['Cargando...', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      email: ['Cargando...'],
      password: ['*********', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuarioService.getUsuario().subscribe((data: Usuario) => {
      this.usuario = data;

      this.rolTexto = 
      this.usuario.rol_id === 2 ? 'Usuario' :
      this.usuario.rol_id === 3 ? 'Administrador' : 'Rol desconocido';
      this.form.patchValue({
        name: this.usuario.name,
        email: this.usuario.email
      });
    });
  }

  activarEdicionNombre() {
    this.editModeName = !this.editModeName;
    if (!this.editModeName) {
      this.form.patchValue({ name: this.usuario?.name });
    }
  }

  activarEdicionPassword() {
    this.editModePassword = !this.editModePassword;

    if (this.editModePassword) {
      this.passwordOriginal = this.form.value.password;
      this.form.patchValue({ password: '' });
      this.showPassword = true; 
    } else {
      this.form.patchValue({ password: this.passwordOriginal });
      this.showPassword = false;
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  actualizarUsuario() {
    if (this.form.valid) {
      const name = this.form.value.name.trim(); 
      const password = this.form.value.password.trim(); 
  
      if (name === '' || password === '') {
        this.toastr.error('El nombre o la contraseña no pueden estar vacíos o contener solo espacios en blanco', 'Error');
        return;
      }
  
      const isNameUnchanged = name === this.usuario?.name;
      const isPasswordUnchanged = password === this.passwordOriginal;
  
      if (isNameUnchanged && isPasswordUnchanged) {
        this.toastr.warning('No se han realizado cambios en el nombre o la contraseña');
        return; 
      }
  
      const datosActualizados = {
        name: name,
        password: password
      };
  
      this.usuarioService.actualizarUsuario(datosActualizados).subscribe(
        (res: any) => {
          this.toastr.success('Usuario actualizado correctamente');
          this.editModeName = false;
          this.editModePassword = false;
          this.showPassword = false;
          this.cargarUsuario();
        },
        (error: any) => {
          this.toastr.error(error.error.msg || 'Error al actualizar');
        }
      );
    } else {
      this.showValidationErrors();
    }
  }

private showValidationErrors() {
  const controls = this.form.controls;

  if (controls['name'].errors) {
    if (controls['name'].errors['required']) {
      this.toastr.error('El nombre es obligatorio', 'Error');
    } else if (controls['name'].errors['minlength']) {
      this.toastr.error('El nombre debe tener al menos 3 caracteres', 'Error');
    } else if (controls['name'].errors['maxlength']) {
      this.toastr.error('El nombre no puede tener más de 50 caracteres', 'Error');
    }
  }

  if (controls['password'].errors) {
    if (controls['password'].errors['required']) {
      this.toastr.error('La contraseña es obligatoria', 'Error');
    } else if (controls['password'].errors['minlength']) {
      this.toastr.error('La contraseña debe tener al menos 6 caracteres', 'Error');
    }
  }
}
}