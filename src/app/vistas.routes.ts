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
import { CuentasComponent } from './Views/Admin/cuentas/cuentas.component';
import { rolesGuard } from './core/guards/roles.guard';
import { DeleteMonitorsComponent } from './Views/Admin/delete-monitors/delete-monitors.component';
import { MonitoresAnalisisComponent } from './Views/Admin/reporte-monitor/monitores-analisis/monitores-analisis.component';


export const routes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate : [rolesGuard(2)]
    },
    {
        path: 'charts',
        component: ChartsComponent,
        canActivate : [rolesGuard(2)]
    },
    {
        path : 'live/:id',
        component : RealtimechartsComponent,
        canActivate : [rolesGuard(2)]
    },
    {
        path: 'perfil',
        component: PerfilComponent,
        canActivate : [rolesGuard(2)]
    },
    {
        path: 'monitor',
        component: MonitorComponent,
        canActivate : [rolesGuard(2)]
    },
    {
        path: 'Confirm_Acount',
        component: CodeFieldComponent,
        canActivate : [rolesGuard(1)]

    },
    {
        path: 'admin',
        component: PanelComponent,
        canActivate : [rolesGuard(3)]
    },
    {
        path: 'admin/users',
        component: CuentasComponent,
        canActivate : [rolesGuard(3)]
    },
    { path: 'monitor/editar/:id', 
        component: MonitorComponent,
        canActivate : [rolesGuard(2)] },
    {
        path: 'admin/monitors-delete',
        component: DeleteMonitorsComponent,
        canActivate: [rolesGuard(3)]
    },
    {
        path: 'admin/reporte',
        component: MonitoresAnalisisComponent,
        canActivate: [rolesGuard(3)]
    }
]