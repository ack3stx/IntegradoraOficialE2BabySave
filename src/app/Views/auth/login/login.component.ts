import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LoginCredentials } from '../../../core/models/login-credentials';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  FormularioLogin = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(1)
    ]),
    rememberMe: new FormControl(false)
  });


  onlogin() {
    if (this.FormularioLogin.valid) {
      const formValues = this.FormularioLogin.value;

      const credentials: LoginCredentials = {
        email: formValues.email || '',
        password: formValues.password || ''
      };
      
      this.authService.login(credentials).subscribe({
        next: (response) => {

          if(formValues.rememberMe){
            localStorage.setItem('token', response.token);
          }
          else{
            sessionStorage.setItem('token', response.token);  
          }
          
          const decoded: any = jwtDecode(response.token);
          this.toastr.success('Login exitoso');
          const userRole = decoded.rol;
          switch (userRole) {
            case 1:
              this.router.navigate(['/activar']);
              break;
            case 2:
              this.router.navigate(['/dashboard']);
              break;
            case 3:
              this.router.navigate(['/admin']);
              break;
            default:
              this.router.navigate(['/login']);
          }
          
          this.FormularioLogin.reset();
        },
        error: (error) => {
          if(error.status == 403){
            this.toastr.error('Tu cuenta no ha sido activada.', 'Error');
          }
          else if(error.status == 401){
            this.toastr.error('Credenciales inválidas', 'Error');
          }
          else{
            this.toastr.error(error);
          }
          console.log(error);
        }
      });
    }
    else {
      this.toastr.error('Datos inválidos', 'Error');
      
    }
  }
}