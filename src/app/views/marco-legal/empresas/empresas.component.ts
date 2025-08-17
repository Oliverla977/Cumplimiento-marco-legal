import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { cilBuilding, cilActionUndo, cilFolderOpen, cilTrash, cilZoom } from '@coreui/icons';
import { EmpresaModel } from '../../../model/empresa.model';
import { EmpresaService } from '../../../service/empresa.service';
import { IconSetService } from '@coreui/icons-angular';
import { CommonModule } from '@angular/common';
import { ButtonDirective, ButtonCloseDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { ModalModule } from '@coreui/angular';
import { ListGroupDirective, ListGroupItemDirective, ProgressComponent  } from '@coreui/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-empresas',
  imports: [ 
    CommonModule,
    ButtonDirective,
    IconDirective,
    ModalModule,
    ReactiveFormsModule,
    ButtonCloseDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    ProgressComponent 
  ],
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
  //modal para ver detalle de empresa
  detalleEmpresa: EmpresaModel | null = null;
  modalEmpresaVisible: boolean = false;
  nombreEmpresa: string = '';
  sectorEmpresa: string = '';

  constructor(
    private empresaService: EmpresaService,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {

    this.formEmpresa = this.fb.group({
      nombre: ['', Validators.required],
      sector: ['', Validators.required],
      pais: ['', Validators.required] 
    });

    this.cargarEmpresas();


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
    if (this.formEmpresa.valid) {
      const empresaData = this.formEmpresa.value;
  
      console.log('Datos del formulario:', empresaData);
      console.log('Editando:', this.editando);
      console.log('ID de empresa editando:', this.usuarioEditandoId);

      // si estamos editando
      if (this.editando && this.usuarioEditandoId) {
        this.empresaService.actualizarEmpresa(this.usuarioEditandoId, empresaData).subscribe({
          next: (res) => {
            console.log('Empresa actualizada:', res);
            this.cerrarModal();
            this.cargarEmpresas(); // refrescar lista
          },
          error: (err) => {
            console.error('Error actualizando empresa:', err);
          }
        });
      } else {
        // si estamos creando
        this.empresaService.registrarEmpresa(empresaData).subscribe({
          next: (res) => {
            console.log('Empresa registrada:', res);
            this.cerrarModal();
            this.cargarEmpresas(); // refrescar lista
          },
          error: (err) => {
            console.error('Error registrando empresa:', err);
          }
        });
      }
    }
  }



  verDetalleEmpresa(empresa: EmpresaModel): void {
    this.empresaService.obtenerEmpresa(empresa.id_empresa).subscribe({
      next: (res) => {
        if (res.success) {
          this.detalleEmpresa = res.data;
          this.nombreEmpresa = res.data.nombre;
          this.sectorEmpresa = res.data.sector;
          this.modalEmpresaVisible = true;
        }
      },
      error: (err) => {
        console.error('Error obteniendo empresa:', err);
      }
    });
  }

  cargarEmpresas(): void {
    this.empresaService.obtenerEmpresas().subscribe({
      next: (res) => {
        if (res.success) {
          this.empresas = res.data;
          console.log('Empresas cargadas:', this.empresas);
  
          setTimeout(() => {
            if (this.dataTableInitialized) {
              const table = ($('#tablaEmpresas') as any).DataTable();
              table.clear();
              table.rows.add(this.empresas); // actualizar filas
              table.draw(); // redibujar tabla
            } else {
              ($('#tablaEmpresas') as any).DataTable({
                data: this.empresas,
                columns: [
                  { data: 'id_empresa' },
                  { data: 'nombre' },
                  { data: 'sector' },
                  { data: 'pais' },
                  { 
                    data: 'id_estado',
                    render: (data: number) => data === 1 ? 'Habilitada' : 'Deshabilitada'
                  },
                  {
                    data: null,
                    render: (data: EmpresaModel) => {
                      const estado = data.id_estado === 1 ? 'desactivar-empresa' : 'activar-empresa';
                      const colorBtn = data.id_estado === 1 ? 'danger' : 'success';
                      const titleBtn = data.id_estado === 1 ? 'Deshabilitar Empresa' : 'Habilitar Empresa';
                      return `
                      <button class="btn btn-outline-secondary btn-sm ver-empresa" data-id="${data.id_empresa}" title="Ver Empresa">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                          <path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                          </svg>
                      </button>

                      <button class="btn btn-outline-warning btn-sm editar-empresa" data-id="${data.id_empresa}" title="Editar Empresa">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
                          </svg>
                      </button>

                      <button class="btn btn-outline-${colorBtn} btn-sm estado-empresa" data-id="${data.id_empresa}" title="${titleBtn}">
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                            <path d="m482-200 114-113-114-113-42 42 43 43q-28 1-54.5-9T381-381q-20-20-30.5-46T340-479q0-17 4.5-34t12.5-33l-44-44q-17 25-25 53t-8 57q0 38 15 75t44 66q29 29 65 43.5t74 15.5l-38 38 42 42Zm165-170q17-25 25-53t8-57q0-38-14.5-75.5T622-622q-29-29-65.5-43T482-679l38-39-42-42-114 113 114 113 42-42-44-44q27 0 55 10.5t48 30.5q20 20 30.5 46t10.5 52q0 17-4.5 34T603-414l44 44ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
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
  
              // Capturar clicks de botones creados por DataTables
              // $('#tablaEmpresas').on('click', '.ver-empresa', (event: any) => {
              //   const id = $(event.currentTarget).data('id');
              //   this.verDetalleEmpresa({ id_empresa: id } as EmpresaModel);
              // });
  
              this.dataTableInitialized = true;

              $('#tablaEmpresas tbody').off('click').on('click', 'button', (event) => {
                const button = $(event.currentTarget);
                const id_empresa = Number(button.data('id'));
                const empresa = this.empresas.find(e => e.id_empresa === id_empresa);
            
                if (button.hasClass('ver-empresa')) {
                  this.verDetalleEmpresa(empresa!);
                }
            
                if (button.hasClass('editar-empresa')) {
                  this.editarEmpresa(id_empresa);
                  console.log('Editar empresa con ID BTN:', id_empresa);
                }
            
                if (button.hasClass('estado-empresa')) {
                  if (empresa) {
                    this.cambiarEstado(empresa.id_empresa, empresa.id_estado!);
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

  editarEmpresa(id_empresa: number): void {
    this.empresaService.obtenerEmpresa(id_empresa).subscribe({
      next: (res) => {
        if (res.success) {
          const empresa = res.data;
          this.editando = true;
          this.usuarioEditandoId = id_empresa;
          this.modalVisible = true;
  
          // cargar datos en el formulario
          this.formEmpresa.patchValue({
            nombre: empresa.nombre,
            sector: empresa.sector,
            pais: empresa.pais
          });
          console.log('Empresa para editar:', this.editando);
          console.log('ID de empresa para editar:', this.usuarioEditandoId);
        }
      },
      error: (err) => {
        console.error('Error obteniendo empresa para editar:', err);
      }
    });
  }

  cambiarEstado(id_empresa: number, id_estado: number): void {
    if (id_estado === 1) {
      // está habilitada → deshabilitar
      this.empresaService.deshabilitarEmpresa(id_empresa).subscribe({
        next: (res) => {
          console.log('Empresa deshabilitada:', res);
          this.cargarEmpresas();
        },
        error: (err) => console.error('Error deshabilitando empresa:', err)
      });
    } else {
      // está deshabilitada → habilitar
      this.empresaService.habilitarEmpresa(id_empresa).subscribe({
        next: (res) => {
          console.log('Empresa habilitada:', res);
          this.cargarEmpresas();
        },
        error: (err) => console.error('Error habilitando empresa:', err)
      });
    }
  }
  
  


}
