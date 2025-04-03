import { Component, inject } from '@angular/core';
import { Validators, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RecoveryService } from '../../../core/services/resend-email/recovery.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResendE } from '../../../core/models/resend-e';

@Component({
  selector: 'app-password-recovery',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {

  private recoveryService = inject(RecoveryService);
  private router = inject(Router);
  private tostadas = inject(ToastrService);

  FormularioRecovery = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  onRecover() {
    if (this.FormularioRecovery.valid) {
      const formValues = this.FormularioRecovery.value;

      const recoveryData: ResendE = {
        email: formValues.email || ''
      };

      this.recoveryService.recovery(recoveryData).subscribe({
        next: (response) => {
          this.tostadas.success('Recuperación exitosa');
          this.FormularioRecovery.reset();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          if (error.status === 422 || error.status === 403 || error.status === 404) {
            const validationErrors = error.error;
            for (const field in validationErrors) {
              if (validationErrors.hasOwnProperty(field)) {
                this.tostadas.error(`${field}: ${validationErrors[field]}`);
              }
            }
          } else {
            this.tostadas.error('Ocurrió un error inesperado');
          }
          console.log('Error completo:', error);
        }
      });
    } else {
      this.tostadas.error('Datos incorrectos');
      console.log('Datos inválidos', 'Error');
    }
  }
}