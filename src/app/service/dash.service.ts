import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../global/vars';

@Injectable({
  providedIn: 'root'
})
export class DashService {

   // Use the global variable for the API URL
    private apiUrl : string = URL_API;
  
    constructor(private http: HttpClient) { }
  
    // GET /dashboard/resumen → Obtener resumen del dashboard
    obtenerResumen(): Observable<{ success: boolean; data: any }> {
      return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/dashboard/resumen`);
    }
  
    // GET /dashboard/resumencumplimiento/:modo → Obtener resumen de cumplimiento 
    obtenerResumenCumplimiento(modo: string): Observable<{ success: boolean; data: any }> {
      return this.http.get<{ success: boolean; data: any }>(`${this.apiUrl}/dashboard/resumencumplimiento`, {
        params: { modo }
      });
}

}
