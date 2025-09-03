import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./nivel-madurez.component').then(m => m.NivelMadurezComponent),
    data: {
      title: 'Niveles de Madurez'
    }
  }
];

