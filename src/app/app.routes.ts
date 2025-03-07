import { Routes } from '@angular/router';
import { LoginComponent } from './Views/auth/login/login.component';
import { RegisterComponent } from './Views/auth/register/register.component';
import { WelcomeComponent } from './Views/welcome/welcome.component';
import { PasswordRecoveryComponent } from './Views/auth/password-recovery/password-recovery.component';
import { rolesGuard } from './core/guards/roles.guard';
import { rutasGuard } from './core/guards/rutas.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [rolesGuard(0)]
    },
    {
        path: 'Password',
        component: PasswordRecoveryComponent,
        canActivate: [rolesGuard(0)]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [rolesGuard(0)]
    },
    {
        path : 'welcome',
        component : WelcomeComponent,
        canActivate : [rolesGuard(0)]
    },
    {
        path: '',
        component: WelcomeComponent,
        canActivate : [rolesGuard(0)]
    },
    {
        canMatch: [rutasGuard],
        path: '',
        loadChildren: () => import('./vistas.routes').then(m => m.routes),
    },
]