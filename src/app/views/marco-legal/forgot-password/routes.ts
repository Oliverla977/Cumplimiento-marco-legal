import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./forgot-password.component').then(m => m.ForgotPasswordComponent),
    data: {
      title: 'Recuperar Contraseña'
    }
  }
];

