import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', () => {
      const navbarItems = document.querySelectorAll('.navbar-nav .nav-item .nav-link');
      const navbarCollapse = document.querySelector('.navbar-collapse');
    
      navbarItems.forEach((item) => {
        item.addEventListener('click', () => {
          this.closeMenu(); // Llama al nuevo método para cerrar el menú
        });
      });
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {  
    this.authService.RemoverToken();
    return this.router.navigate(['/login']);
  }

  Role(role: number): boolean {
    const token = localStorage.getItem('token');

    if (!token) {
      return role === 0;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userRole = decoded.rol ?? 0;

      return userRole === role;
    } catch (error) {
      console.error('Error al decodificar el token', error);
      return false;
    }
  }

  checarSesion() {
    const token = localStorage.getItem('token');

    if (!token) {
      return false;
    }
    return true;
  }

  closeMenu(): void {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  }
  
  toggleMenu(): void {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse) {
      const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse, { toggle: true });
      bsCollapse.toggle();
    }
  }
}