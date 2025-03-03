import { Routes } from '@angular/router';
import { LoginComponent } from './Views/auth/login/login.component';
import { RegisterComponent } from './Views/auth/register/register.component';
import { WelcomeComponent } from './Views/welcome/welcome.component';
import { DashboardComponent } from './Views/dashboard/dashboard/dashboard.component';
import { InsertComponent } from './Views/products/insert/insert.component';
import { ShowComponent } from './Views/products/show/show.component';
import { authTokenGuard } from './core/guards/auth-token.guard';
import { loginGuard } from './core/guards/login.guard';
import { DeleteComponent } from './Views/products/delete/delete.component';
import { UpdateComponent } from './Views/products/update/update.component';
import { PasswordRecoveryComponent } from './Views/auth/password-recovery/password-recovery.component';
import { ChartsComponent } from './Views/charts/charts.component';
import { MonitorComponent } from './Views/monitor/monitor.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'Password',
        component: PasswordRecoveryComponent,
        canActivate: [loginGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [loginGuard]
    },
    {
        path : 'welcome',
        component : WelcomeComponent,
        canActivate : [loginGuard]
    },
    {
        path: '',
        component: WelcomeComponent,
        canActivate : [loginGuard]
    },
    {
        path: 'insert',
        component: InsertComponent,
        canActivate: [authTokenGuard]

    },
    {
        path: 'show',
        component: ShowComponent,
        canActivate: [authTokenGuard]
    },
    {
        path: 'delete',
        component: DeleteComponent,
        canActivate: [authTokenGuard]
    },
    {
        path: 'update',
        component: UpdateComponent,
        canActivate: [authTokenGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authTokenGuard]
    },
    {
        path: 'charts',
        component: ChartsComponent,
    },
    {
        path: 'monitor',
        component: MonitorComponent
    }
    
]