import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./detalle-evaluacion.component').then(m => m.DetalleEvaluacionComponent),
    data: {
      title: 'Detalle de Evaluación'
    }
  }
];

