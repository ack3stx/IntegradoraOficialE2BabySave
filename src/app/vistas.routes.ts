import { Routes } from '@angular/router';
import { DashboardComponent } from './Views/dashboard/dashboard/dashboard.component';
import { authTokenGuard } from './core/guards/auth-token.guard';
import { ChartsComponent } from './Views/charts/charts.component';
import { MonitorComponent } from './Views/monitor/monitor.component';
import { loginGuard } from './core/guards/login.guard';
import { CodeFieldComponent } from './Views/auth/code-field/code-field.component';
import { PerfilComponent } from './Views/auth/perfil/perfil.component';
import { RealtimechartsComponent } from './Views/real_time_charts/realtimecharts/realtimecharts.component';
import { PanelComponent } from './Views/Admin/panel/panel.component';


export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authTokenGuard],
    },
    {
        path: 'charts',
        component: ChartsComponent,
    },
    {
        path : 'live',
        component : RealtimechartsComponent
    },
    {
        path: 'perfil',
        component: PerfilComponent,
    },
    {
        path: 'monitor',
        component: MonitorComponent
    },
    {
        path: 'Confirm_Acount',
        component: CodeFieldComponent,
        canActivate: [loginGuard]

    },
    {
        path: 'admin',
        component: PanelComponent
    }
]