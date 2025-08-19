import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./nuevomarcolegal.component').then(m => m.NuevomarcolegalComponent),
    data: {
      title: 'Nuevo Marco Legal'
    }
  }
];

