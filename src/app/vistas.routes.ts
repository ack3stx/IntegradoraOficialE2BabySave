import { Routes } from '@angular/router';
import { DashboardComponent } from './Views/dashboard/dashboard/dashboard.component';
import { InsertComponent } from './Views/products/insert/insert.component';
import { ShowComponent } from './Views/products/show/show.component';
import { authTokenGuard } from './core/guards/auth-token.guard';
import { DeleteComponent } from './Views/products/delete/delete.component';
import { UpdateComponent } from './Views/products/update/update.component';
import { ChartsComponent } from './Views/charts/charts.component';
import { MonitorComponent } from './Views/monitor/monitor.component';


export const routes: Routes = [
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
        canActivate: [authTokenGuard],
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