import { Injectable } from '@angular/core';
import { EmpresaModel } from '../model/empresa.model';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../global/vars';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  
  // Use the global variable for the API URL
  private apiUrl : string = URL_API;

  constructor(private http: HttpClient) { }

  // POST /empresas/registro → Registrar nueva empresa
  registrarEmpresa(empresa: EmpresaModel): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresas/registro`, empresa);
  }

  // GET /empresas → Obtener todas las empresas
  obtenerEmpresas(): Observable<{ success: boolean; data: EmpresaModel[] }> {
    return this.http.get<{ success: boolean; data: EmpresaModel[] }>(`${this.apiUrl}/empresas`);
  }

  // GET /empresas/:id_empresa → Obtener empresa por ID
  obtenerEmpresa(id_empresa: number): Observable<{ success: boolean; data: EmpresaModel }> {
    return this.http.get<{ success: boolean; data: EmpresaModel }>(`${this.apiUrl}/empresas/${id_empresa}`);
  }

  // PUT /empresas/actualizar/:id_empresa → Actualizar empresa
  actualizarEmpresa(id_empresa: number, empresa: EmpresaModel): Observable<any> {
    return this.http.put(`${this.apiUrl}/empresas/actualizar/${id_empresa}`, empresa);
  }

  // PUT /empresas/deshabilitar/:id_empresa → Deshabilitar empresa
  deshabilitarEmpresa(id_empresa: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/empresas/deshabilitar/${id_empresa}`, {});
  }

  // PUT /empresas/habilitar/:id_empresa → Habilitar empresa
  habilitarEmpresa(id_empresa: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/empresas/habilitar/${id_empresa}`, {});
  }

  // POST /empresas/asignar-auditor → Asignar auditor a empresa
  asignarAuditor(id_empresa: number, id_usuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/empresas/asignar-auditor`, { id_empresa, id_usuario });
  }

}
