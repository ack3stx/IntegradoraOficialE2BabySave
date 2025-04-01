import { Component,inject } from '@angular/core';
import { Validators,FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { ResendService } from '../../../core/services/resend-email/resend.service';
import { Router,RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResendE } from '../../../core/models/resend-e';

@Component({
  selector: 'app-resend-email',
  imports: [ReactiveFormsModule,RouterModule],
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
  

  onLogin() {
    if (this.FormularioRegister.valid) {
      const formValues = this.FormularioRegister.value;

      const reenvioData:ResendE  = {
        email: formValues.email || ''
      };
      
      this.resendService.reenvio(reenvioData).subscribe({
        next: (response) => {
          this.tostadas.success('Reenvio exitoso');
          this.FormularioRegister.reset();
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
    }
    else {
      this.tostadas.error('Datos incorrectos');
      console.log('Datos inválidos', 'Error');
    }
  }

}
