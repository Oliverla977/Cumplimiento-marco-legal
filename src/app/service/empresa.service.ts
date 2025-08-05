import { Injectable } from '@angular/core';
import { EmpresaModel } from '../model/empresa.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  
  private empresas:EmpresaModel[]=[
    {id_empresa:1,nombre:'Empresa A',sector:'Tecnología', estado:'Habilitada'},
    {id_empresa:2,nombre:'Empresa B',sector:'Salud', estado:'Habilitada'},
    {id_empresa:3,nombre:'Empresa C',sector:'Educación', estado:'Deshabilitada'},
    {id_empresa:4,nombre:'Empresa D',sector:'Finanzas', estado:'Habilitada'},
    {id_empresa:5,nombre:'Empresa E',sector:'Manufactura', estado:'Habilitada'},
    {id_empresa:6,nombre:'Empresa F',sector:'Comercio', estado:'Habilitada'},
    {id_empresa:7,nombre:'Empresa G',sector:'Transporte', estado:'Habilitada'},
    {id_empresa:8,nombre:'Empresa H',sector:'Energía', estado:'Habilitada'},
    {id_empresa:9,nombre:'Empresa I',sector:'Turismo', estado:'Habilitada'},
    {id_empresa:10,nombre:'Empresa J',sector:'Construcción', estado:'Habilitada'},
    {id_empresa:11,nombre:'Empresa K',sector:'Agricultura', estado:'Habilitada'},
    {id_empresa:12,nombre:'Empresa L',sector:'Telecomunicaciones', estado:'Deshabilitada'}
  ]

  constructor() { }

  getEmpresas(): Observable<EmpresaModel[]> {
    return of(this.empresas);
  }
}
