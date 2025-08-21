import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../global/vars';

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  
  private apiUrl : string = URL_API;

  constructor(private http: HttpClient) { }

  iniciarEvaluacion(id_empresa: number, id_marco_legal: number, id_usuario: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/evaluacion/encabezado`, {id_empresa, id_marco_legal, id_usuario});
  }

  guardarEvaluaciones(detalles: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/evaluacion/detalle`, detalles);
  }

  obtenerResumenEvaluaciones(id_empresa: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/evaluacion/resumen/${id_empresa}`);
  }

}
