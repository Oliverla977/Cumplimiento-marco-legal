import { Routes } from '@angular/router';
import { authGuard } from './security/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: {
      title: 'Inicio'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./views/marco-legal/usuarios/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'empresas',
        loadChildren: () => import('./views/marco-legal/empresas/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      // New Password and Forgot Password routes
      {
        path: 'newPassword',
        loadChildren: () => import('./views/marco-legal/new-password/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'forgotPassword',
        loadChildren: () => import('./views/marco-legal/forgot-password/routes').then((m) => m.routes)
      },
      {
        path: 'marcoslegales',
        loadChildren: () => import('./views/marco-legal/marcos/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'nuevomarcolegal',
        loadChildren: () => import('./views/marco-legal/nuevomarcolegal/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'evaluaciones',
        loadChildren: () => import('./views/marco-legal/evaluaciones/routes').then((m) => m.routes),
        canActivate: [authGuard]
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
