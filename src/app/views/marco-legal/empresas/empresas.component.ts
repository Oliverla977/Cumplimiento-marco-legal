import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { cilBuilding, cilActionUndo, cilFolderOpen, cilTrash, cilZoom } from '@coreui/icons';
import { EmpresaModel } from '../../../model/empresa.model';
import { EmpresaService } from '../../../service/empresa.service';
import { IconSetService } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { ButtonDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ModalModule } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-empresas',
  imports: [ CommonModule, ButtonDirective, IconDirective, ModalModule, ReactiveFormsModule],
  templateUrl: './empresas.component.html',
  styleUrl: './empresas.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class EmpresasComponent implements OnInit, OnDestroy, AfterViewInit {

  readonly #iconSetService = inject(IconSetService);
  empresas: EmpresaModel[] = [];
  dataTableInitialized = false;
  modalVisible: boolean = false;
  formEmpresa!: FormGroup;
  editando: boolean = false;
  usuarioEditandoId: number | null = null;

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.empresaService.getEmpresas().subscribe(data => {
      this.empresas = data;
    });

    this.formEmpresa = this.fb.group({
      nombre: ['', Validators.required],
      sector: ['', Validators.required]
    });

    this.#iconSetService.icons = {
      ...this.#iconSetService.icons,
      cilBuilding,
      cilActionUndo,
      cilFolderOpen,
      cilTrash,
      cilZoom
    }
  }

  ngOnDestroy(): void {
    if (this.dataTableInitialized) {
      ($('#tablaEmpresas') as any).DataTable().destroy();
      this.dataTableInitialized = false;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.dataTableInitialized) {
        ($('#tablaEmpresas') as any).DataTable({
          language: {
            lengthMenu: 'Mostrar _MENU_ registros por página',
            zeroRecords: 'No se encontraron resultados',
            info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
            infoEmpty: 'Mostrando 0 a 0 de 0 registros',
            infoFiltered: '(filtrado de _MAX_ registros totales)',
            search: 'Buscar:',
            loadingRecords: 'Cargando...',
            processing: 'Procesando...',
            emptyTable: 'No hay datos disponibles en la tabla'
          },
          scrollX: true
        });
        this.dataTableInitialized = true;
      }
    }, 200);
  }

  desactivarEmpresa(empresa: EmpresaModel): void {
      empresa.estado = 'Deshabilitada';
      console.log('Empresa desactivada:', empresa);
    }
  
  activarEmpresa(empresa: EmpresaModel): void {
    empresa.estado = 'Habilitada';
    console.log('Empresa activada:', empresa);
  }

  abrirModal(): void {
    this.modalVisible = true;
    this.formEmpresa.reset();
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.editando = false;
    this.usuarioEditandoId = null;
    this.formEmpresa.reset();
  }

  guardarEmpresa(): void {
    //console.log('Formulario de empresa:', this.formEmpresa.value);
    console.log('Estado del formulario:', this.formEmpresa.valid);
    if (this.formEmpresa.valid) {
      const nuevaEmpresa = this.formEmpresa.value;
      console.log('Empresa a guardar:', nuevaEmpresa);
      // llamar a un método de servicio
      this.cerrarModal();
    }
  }

  editarEmpresa(empresa: any): void {
  this.editando = true;
  this.usuarioEditandoId = empresa.id_usuario;
  this.modalVisible = true;

  this.formEmpresa.setValue({
      nombre: empresa.nombre,
      sector: empresa.sector,
    });
  }

  actualizarEmpresa(): void {
    if (this.formEmpresa.valid && this.usuarioEditandoId !== null) {
      const datosActualizados = {
        id_usuario: this.usuarioEditandoId,
        ...this.formEmpresa.value
      };
      console.log('Actualizar empresa:', datosActualizados);
      // servcio para actualizar
      this.cerrarModal();
    }
  }

}
