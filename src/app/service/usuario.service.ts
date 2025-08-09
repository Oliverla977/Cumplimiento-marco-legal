import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { UsuarioModel } from "../model/usuario.model";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private apiUrl = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  obtenerUsuarios(): Observable<{ success: boolean; data: UsuarioModel[] }> {
    return this.http.get<{ success: boolean; data: UsuarioModel[] }>(this.apiUrl);
  }

  deshabilitarUsuario(id_usuario: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/deshabilitar/${id_usuario}`, {});
}

  habilitarUsuario(id_usuario: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/habilitar/${id_usuario}`, {});
  }
}
