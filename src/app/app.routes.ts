import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    {
        path:"",
        redirectTo:"welcome",
        pathMatch:"full"
    },
    {
        path: 'welcome',
        loadComponent: () =>
          import('./components/welcome/welcome.component')
            .then(({ WelcomeComponent }) => WelcomeComponent)
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./components/auth/login/login.component')
           .then(({ LoginComponent }) => LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./components/auth/register/register.component')
            .then(({ RegisterComponent }) => RegisterComponent)
      },
      {
        path: 'hasta-dashboard',
        loadComponent: () =>
          import('./components/hasta/hasta-dashboard/hasta-dashboard.component')
           .then(({ HastaDashboardComponent }) => HastaDashboardComponent),
           canActivate: [authGuard]
      },
      {
        path: 'doktor-dashboard',
        loadComponent: () =>
          import('./components/doktor/doktor-dashboard/doktor-dashboard.component')
           .then(({ DoktorDashboardComponent }) => DoktorDashboardComponent),
           canActivate: [authGuard]
      },
      {
        path: 'admin-dashboard',
        loadComponent: () =>
          import('./components/admin/admin-dashboard/admin-dashboard.component')
           .then(({ AdminDashboardComponent }) => AdminDashboardComponent),
           canActivate: [authGuard]
      },


];
