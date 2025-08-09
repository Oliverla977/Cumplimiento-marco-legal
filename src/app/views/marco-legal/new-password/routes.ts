import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./new-password.component').then(m => m.NewPasswordComponent),
    data: {
      title: 'Cambiar Contraseña'
    }
  }
];

