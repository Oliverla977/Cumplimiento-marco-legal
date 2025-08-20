import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { cilBuilding, cilActionUndo, cilFolderOpen, cilTrash, cilZoom } from '@coreui/icons';
import { EmpresaModel } from '../../../model/empresa.model';
import { AuditorModel } from '../../../model/auditores.model';
import { AuditorEmpresaModel } from '../../../model/auditoresEmpresa.model';
import { IconSetService } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { ButtonDirective, ButtonCloseDirective, AccordionModule } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ModalModule } from '@coreui/angular';
import { ListGroupDirective, ListGroupItemDirective, ProgressComponent  } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import $ from 'jquery';
import 'datatables.net';
import { FormsModule } from '@angular/forms';
import { MarcolegalService } from '../../../service/marcolegal.service';
import { MarcoLegalModel } from '../../../model/marcolegal.model';
import {
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective
} from '@coreui/angular';

// CoreUI Angular
import { ButtonModule } from '@coreui/angular'; // incluye c-button



@Component({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  selector: 'app-marcos',
  imports: [
    CommonModule,
    ButtonDirective,
    ButtonCloseDirective,
    IconDirective,
    ModalModule,
    ListGroupDirective,
    ListGroupItemDirective,
    ProgressComponent,
    ReactiveFormsModule,
    FormsModule,
    AccordionModule,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalBodyComponent,
    ModalFooterComponent,
    ButtonDirective,
    ButtonModule
  ],
  templateUrl: './marcos.component.html',
  styleUrl: './marcos.component.scss'
})
export class MarcosComponent {

    empresas: EmpresaModel[] = [];
    dataTableInitialized = false;
  modalVisible: boolean = false;
  formEmpresa!: FormGroup;
  editando: boolean = false;
  usuarioEditandoId: number | null = null;
  //modal para ver detalle de empresa
  detalleEmpresa: EmpresaModel | null = null;
  modalEmpresaVisible: boolean = false;
  idEmpresaSeleccionada: number | null = null;
  nombreEmpresa: string = '';
  sectorEmpresa: string = '';

  modalAuditorVisible: boolean = false;
  auditores: AuditorModel[] = [];
  auditorSeleccionado: number = 0;
  auditoresEmpresa: AuditorEmpresaModel[] = [];

  marcoLegalModel: MarcoLegalModel[] = [];

  modalMarcoVisible: boolean = false;
  marcoLegal: any;


  constructor(private marcoService: MarcolegalService, private iconSet: IconSetService, private fb: FormBuilder) {
    this.iconSet.icons = { cilBuilding, cilActionUndo, cilFolderOpen, cilTrash, cilZoom };
  }

  ngOnInit(): void {
    this.cargarMarcosLegales();
  }
    

  cargarMarcosLegales(): void {
    this.marcoService.getMarcosLegales().subscribe({
      next: (res) => {
        if (res.success) {
          this.marcoLegalModel = res.data;
          console.log('marcoes legales cargadss:', this.marcoLegalModel);
  
          setTimeout(() => {
            if (this.dataTableInitialized) {
              const table = ($('#tabla') as any).DataTable();
              table.clear();
              table.rows.add(this.marcoLegalModel); // actualizar filas
              table.draw(); // redibujar tabla
            } else {
              ($('#tabla') as any).DataTable({
                data: this.marcoLegalModel,
                columns: [
                  { data: 'id_marco_legal' },
                  { data: 'nombre' },
                  { data: 'pais_origen' },
                  { data: 'descripcion' },
                  {
                    data: null,
                    render: (data: MarcoLegalModel) => {
                      return `
                      <button class="btn btn-outline-secondary btn-sm ver-empresa" data-id="${data.id_marco_legal}" title="Ver">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                          <path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                          </svg>
                      </button>
                    `
                  }}
                ],
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

              $('#tabla tbody').off('click').on('click', 'button', (event) => {
                const button = $(event.currentTarget);
                const id_marco_legal = Number(button.data('id'));
                const marco = this.marcoLegalModel.find(e => e.id_marco_legal === id_marco_legal);
            
                if (button.hasClass('ver-empresa')) {
                  this.verMarcoLegal(id_marco_legal);
                }
            
                if (button.hasClass('editar-empresa')) {
                  //this.editarEmpresa(id_empresa);
                  console.log('Editar  con ID BTN:', id_marco_legal);
                }
            
                if (button.hasClass('estado-empresa')) {
                  if (marco) {
                    //this.cambiarEstado(empresa.id_empresa, empresa.id_estado!);
                  }
                }
              });
            }
          }, 200);
        }
      },
      error: (err) => {
        console.error('Error cargando empresas:', err);
      }
    });
  }

  verMarcoLegal(id_marco_legal: number): void {
    this.marcoService.getMarcosLegalesporID(id_marco_legal).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.marcoLegal = resp.data; // JSON anidado desde la API
          this.modalMarcoVisible = true;
        }
      },
      error: (err) => {
        console.error('Error cargando marco legal:', err);
      }
    });
  }

  cerrarModalMarco() {
  this.modalMarcoVisible = false;
  this.marcoLegal = null;
}


}
