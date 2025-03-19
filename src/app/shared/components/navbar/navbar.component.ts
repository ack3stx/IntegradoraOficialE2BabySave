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

  isLoggedIn(): boolean {
    const token = this.authService.LeerToken();

    return !!token;
  }

  logout() {  
    this.authService.RemoverToken();
    return this.router.navigate(['/login']);
  }
  

  Role(role: number): boolean {
    const token = this.authService.LeerToken();

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

  checarSesion()
  {
    const token = this.authService.LeerToken();

    if (!token) {
      return false;
    }
    return true
  }

}