import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { UsuarioModel } from "../model/usuario.model";
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../global/vars';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // Use the global variable for the API URL
  private apiUrl : string = URL_API;

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/registro`, usuario);
  }

  obtenerUsuarios(): Observable<{ success: boolean; data: UsuarioModel[] }> {
    return this.http.get<{ success: boolean; data: UsuarioModel[] }>(`${this.apiUrl}/usuarios/`);
  }

  deshabilitarUsuario(id_usuario: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/usuarios/deshabilitar/${id_usuario}`, {});
}

  habilitarUsuario(id_usuario: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/habilitar/${id_usuario}`, {});
  }
}
