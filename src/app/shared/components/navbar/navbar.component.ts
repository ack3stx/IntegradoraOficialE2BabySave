import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', () => {
      const navbarItems = document.querySelectorAll('.navbar-nav .nav-item .nav-link');
      const navbarCollapse = document.querySelector('.navbar-collapse');
    
      navbarItems.forEach((item) => {
        item.addEventListener('click', () => {
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new (window as any).bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
          }
        });
      });
    });
  }

  // isScrolled = false;

  // @HostListener('window:scroll', [])
  // onWindowScroll(): void {
  //   this.isScrolled = window.scrollY > 50;
  // }

  private router = inject(Router);
  private authService = inject(AuthService);

  // Método para verificar si está logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}