import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { UsuarioModel } from "../model/usuario.model";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private usuarios: UsuarioModel[] = [
    { id_usuario: 1, nombre: 'Juan Perez', correo: 'juanperez@gmail.com', id_rol: 1, rol: 'Administrador', estado: 'Activo' },
    { id_usuario: 2, nombre: 'Maria Lopez', correo: 'marialopez@gmail.com', id_rol: 2, rol: 'Digitador', estado: 'Activo'  },
    { id_usuario: 3, nombre: 'Carlos Sanchez', correo: 'carlossanchez@gmail.com', id_rol: 3, rol: 'Auditor', estado: 'Activo'  },
    { id_usuario: 4, nombre: 'Pedro Hernandez', correo: 'pedrohernandez@gmail.com', id_rol: 4, rol: 'Supervisor', estado: 'Inactivo'  }
  ];

  constructor() { }

  getUsuarios(): Observable<UsuarioModel[]> {
    return of(this.usuarios);
  }

  getUsuarioById(id: number): Observable<UsuarioModel | undefined> {
    const usuario = this.usuarios.find(u => u.id_usuario === id);
    return of(usuario);
  }
}
