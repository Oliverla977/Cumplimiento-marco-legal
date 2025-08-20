import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URL_API } from '../global/vars';
import { MarcoLegalModel } from '../model/marcolegal.model';

@Injectable({
  providedIn: 'root'
})
export class MarcolegalService {
  
  private apiUrl : string = URL_API;

  constructor(private http: HttpClient) { }

  registrarMarcoLegal(marcoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/marcoslegales/registrar`, marcoData);
  }

  // GET obtener todos los marcos legales
  getMarcosLegales(): Observable<{ success: boolean; data: MarcoLegalModel[] }> {
    return this.http.get<{ success: boolean; data: MarcoLegalModel[] }>(`${this.apiUrl}/marcoslegales`);
  }

  // GET obtener un marco legal por ID
  getMarcosLegalesporID(id: number): Observable<{ success: boolean; data: any[] }> {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.apiUrl}/marcoslegales/${id}`);
  }
  
}
