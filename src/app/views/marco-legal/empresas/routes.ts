import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./empresas.component').then(m => m.EmpresasComponent),
    data: {
      title: 'Empresas'
    }
  }
];

