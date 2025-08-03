import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { Usuario } from "../model/usuario.model";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private usuarios: Usuario[] = [
    { id: 1, nombre: 'Juan Perez' },
    { id: 2, nombre: 'Maria Lopez' },
    { id: 3, nombre: 'Carlos Sanchez' }
  ];

  constructor() { }

  getUsuarios(): Observable<Usuario[]> {
    return of(this.usuarios);
  }

  getUsuarioById(id: number): Observable<Usuario | undefined> {
    const usuario = this.usuarios.find(u => u.id === id);
    return of(usuario);
  }
}
