import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegisterService } from '../../../core/services/auth/register.service';
import { RegisterCredentials } from '../../../core/models/register-credentials';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',    
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './register.component.html',  
  styleUrls: ['./register.component.css']      
})

export class RegisterComponent {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private registerService = inject(RegisterService);

  FormularioRegister = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(50)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  isSubmitting = false; 

  onRegister() {
    if (this.FormularioRegister.valid) {
      this.isSubmitting = true; 
  
      const formValues = this.FormularioRegister.value;
      const registerData: RegisterCredentials = {
        name: formValues.name || '',
        email: formValues.email || '',
        password: formValues.password || ''
      };
  
      this.registerService.register(registerData).subscribe({
        next: () => {
          this.toastr.success('Registro exitoso y correo de activación enviado', '', {timeOut: 10000});
          this.toastr.info('Revisa tu correo electrónico para activar tu cuenta', '', {timeOut: 10000});
          this.router.navigate(['/login']);
          this.FormularioRegister.reset();
          this.isSubmitting = false; 
        },
        error: (error) => {
          this.isSubmitting = false; 
  
          if (error.status === 422) {
            const errorDetails = error.error.error;
            if (errorDetails.includes('email')) {
              this.toastr.error('El correo electrónico ya está registrado', 'Error');
            } else {
              this.toastr.error(`${errorDetails}`, 'Error');
            }
          } else {
            this.toastr.error('Error en el registro', 'Error');
          }
        }
      });
    } else {
      this.showValidationErrors();
    }
  }
  
  private showValidationErrors() {
    const controls = this.FormularioRegister.controls;
    const anyFieldEmpty = !controls.name.value || !controls.email.value || !controls.password.value;

    if (anyFieldEmpty) {
      this.toastr.error('Completa todos los campos', 'Error');
      return;
    }

    if (controls.name.errors) {
      if (controls.name.errors['minlength']) {
        this.toastr.error('El nombre debe tener al menos 3 caracteres', 'Error');
      } else if (controls.name.errors['maxlength']) {
        this.toastr.error('El nombre no puede tener más de 50 caracteres', 'Error');
      }
    }
    if (controls.email.errors) {
      if (controls.email.errors['email']) {
        this.toastr.error('El correo electrónico no es válido', 'Error');
      } else if (controls.email.errors['maxlength']) {
        this.toastr.error('El correo electrónico no puede tener más de 50 caracteres', 'Error');
      }
    }
    if (controls.password.errors) {
      if (controls.password.errors['minlength']) {
        this.toastr.error('La contraseña debe tener al menos 6 caracteres', 'Error');
      }
    }
  }
}