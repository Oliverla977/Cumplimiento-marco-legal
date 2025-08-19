import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./evaluaciones.component').then(m => m.EvaluacionesComponent),
    data: {
      title: 'Evaluaciones de Cumplimiento'
    }
  }
];

