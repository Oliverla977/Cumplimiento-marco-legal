import { Injectable } from '@angular/core';
import { RolModel } from '../model/rol.model';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RolService {
  
  private roles: RolModel[] = [
    { id_rol: 1, nombre: 'Administrador', descripcion: 'Acceso completo al sistema' },
    { id_rol: 2, nombre: 'Digitador', descripcion: 'Puede ingresar marcoes legales' },
    { id_rol: 3, nombre: 'Auditor', descripcion: 'Puede realizar evaluaciones' },
    { id_rol: 4, nombre: 'Supervisor', descripcion: 'Puede ver y generar reportes' }
  ]

  constructor() { }

  getRoles(): Observable<RolModel[]> {
    return of(this.roles);
  }

  getRolById(id: number): RolModel | undefined {
    return this.roles.find(rol => rol.id_rol === id);
  }
}
