import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../../model/usuario.model';
import { UsuarioService } from '../../../service/usuario.service';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import $ from 'jquery';
import 'datatables.net';


@Component({
  selector: 'app-usuarios',
  imports: [ CommonModule, NgxDatatableModule ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit, AfterViewInit {

  usuarios: Usuario[] = [];
  dataTableInitialized = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.dataTableInitialized) {
        ($('#tablaUsuarios') as any).DataTable();
        this.dataTableInitialized = true;
      }
    }, 200);
  }

}
