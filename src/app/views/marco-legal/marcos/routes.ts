import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./marcos.component').then(m => m.MarcosComponent),
    data: {
      title: 'Marcos Legales'
    }
  }
];

