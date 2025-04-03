import { Component,inject } from '@angular/core';
import { Validators,FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { ResendService } from '../../../core/services/resend-email/resend.service';
import { Router,RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResendE } from '../../../core/models/resend-e';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resend-email',
  imports: [ReactiveFormsModule,RouterModule, CommonModule],
  templateUrl: './resend-email.component.html',
  styleUrl: './resend-email.component.css'
})
export class ResendEmailComponent {

  private resendService =inject(ResendService);
  private router = inject(Router);
  private tostadas = inject(ToastrService);

  FormularioRegister = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  
  isSubmitting = false; 

  onLogin() {
    if (this.FormularioRegister.valid) {
      this.isSubmitting = true;
      const formValues = this.FormularioRegister.value;

      const reenvioData:ResendE  = {
        email: formValues.email || ''
      };
      
      this.resendService.reenvio(reenvioData).subscribe({
        next: () => {
          this.tostadas.success('Reenvio exitoso');
          this.FormularioRegister.reset();
          this.isSubmitting = false;
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isSubmitting = false;
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
    }
    else {
      this.tostadas.error('Datos incorrectos');
      console.log('Datos inválidos', 'Error');
    }
  }

}
