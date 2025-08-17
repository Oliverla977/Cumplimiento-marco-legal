import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioModel } from '../../../model/usuario.model';
import { UsuarioService } from '../../../service/usuario.service';
import $ from 'jquery';
import 'datatables.net';
import { ButtonDirective } from '@coreui/angular';
import { IconDirective, IconSetService  } from '@coreui/icons-angular';
import { cilUserPlus, cilActionUndo } from '@coreui/icons';
import { RolModel } from '../../../model/rol.model';
import { RolService } from '../../../service/rol.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalModule } from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../../service/login.service';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-usuarios',
  imports: [ CommonModule, ButtonDirective, IconDirective, ModalModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UsuariosComponent implements OnInit, AfterViewInit, OnDestroy {

  readonly #iconSetService = inject(IconSetService);
  usuarios: UsuarioModel[] = [];
  dataTableInitialized = false;
  modalVisible: boolean = false;
  formUsuario!: FormGroup;
  roles: RolModel[] = [];
  editando: boolean = false;
  usuarioEditandoId: number | null = null;
  dataTable: any;


  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private rolService: RolService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();

    this.rolService.getRoles().subscribe(data => {
      this.roles = data;
    });

    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      rol: [null, Validators.required]
    });

    this.#iconSetService.icons = {
      ...this.#iconSetService.icons,
      cilUserPlus,
      cilActionUndo
    };
  }

  ngAfterViewInit(): void {
    $('#tablaUsuarios tbody').off('click').on('click', 'button.desactivar', (event) => {
      const id = $(event.currentTarget).data('id');
      this.desactivarUsuarioPorId(id);
    });
    
    $('#tablaUsuarios tbody').on('click', 'button.activar', (event) => {
      const id = $(event.currentTarget).data('id');
      this.activarUsuarioPorId(id);
    });
    
  }
  ngOnDestroy(): void {
    if (this.dataTableInitialized) {
      ($('#tablaUsuarios') as any).DataTable().destroy();
      this.dataTableInitialized = false;
    }
  }

  abrirModal(): void {
    this.modalVisible = true;
    this.formUsuario.reset();
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.editando = false;
    this.usuarioEditandoId = null;
    this.formUsuario.reset();
  }

  guardarUsuario(): void {
  if (this.formUsuario.valid) {
    const nuevoUsuario = this.formUsuario.value;

    console.log('Usuario a guardar:', nuevoUsuario);

    this.loginService.registrarse(nuevoUsuario.correo, 'Umg2025*')
      .then((credenciales) => {
        console.log('Usuario registrado en Firebase', credenciales);

        // Datos a enviar a MySQL
        const usuarioMysql = {
          uid_firebase: credenciales.user.uid,
          nombre: nuevoUsuario.nombre,
          correo: nuevoUsuario.correo,
          rol: nuevoUsuario.rol
        };

        this.usuarioService.registrarUsuario(usuarioMysql).subscribe({
          next: (res) => {
            console.log('Usuario guardado en MySQL', res);
            this.cerrarModal();
            this.cargarUsuarios();
          },
          error: (err) => {
            console.error('Error al guardar en MySQL', err);
          }
        });
      })
      .catch((error) => {
        console.error('Error al registrar en Firebase', error);
      });
  }
}

  editarUsuario(id_usuario: any,nombre: any, correo: any, id_rol: any): void {
  this.editando = true;
  this.usuarioEditandoId = id_usuario;
  this.modalVisible = true;

  this.formUsuario.setValue({
      nombre: nombre,
      correo: correo,
      rol: id_rol
    });
  }

  actualizarUsuario(): void {
    if (this.formUsuario.valid && this.usuarioEditandoId !== null) {
      const datosActualizados = {
        id_usuario: this.usuarioEditandoId,
        ...this.formUsuario.value
      };
      console.log('Actualizar usuario:', datosActualizados);
      // servcio para actualizar el usuario
      this.cerrarModal();
    }
  }

  desactivarUsuario(usuario: UsuarioModel): void {
    this.usuarioService.deshabilitarUsuario(usuario.id_usuario).subscribe({
      next: () => {
        this.cargarUsuarios(); // Recarga la lista
      },
      error: (err) => {
        console.error('Error al deshabilitar usuario:', err);
      }
    });
  }

  activarUsuario(usuario: UsuarioModel): void {
    this.usuarioService.habilitarUsuario(usuario.id_usuario).subscribe({
      next: () => {
        this.cargarUsuarios(); // Recarga la lista
      },
      error: (err) => {
        console.error('Error al habilitar usuario:', err);
      }
    });
  }

  cargarUsuarios(): void {
    console.log('Cargando usuarios...');
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (res) => {
        this.usuarios = res.data;
        console.log('Usuarios cargados:', this.usuarios);
        if (!this.dataTable) {
          this.dataTable = ($('#tablaUsuarios') as any).DataTable({
            data: this.usuarios,
            columns: [
              { data: 'id_usuario' },
              { data: 'nombre' },
              { data: 'correo' },
              { data: 'rol' },
              {
                data: 'estado',
                render: (data: string) => data === 'Activo' ? 'Activo' : 'Inactivo'
              },
              {
                data: null,
                orderable: false,
                render: (data: any, type: any, row: UsuarioModel) => {
                  if (row.estado === 'Activo') {
                    return `<button class="btn btn-outline-danger btn-sm desactivar" data-id="${row.id_usuario}">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                              <title>Desactivar</title>
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0A.5.5 0 0 1 8.5 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                              <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 1 1 0-2H6l1-1h2l1 1h3a1 1 0 0 1 1 1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"/>
                              </svg>
                              </svg>
                            </button>
                            `;
                  } else {
                    return `<button class="btn btn-outline-success btn-sm activar" data-id="${row.id_usuario}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <title>Activar</title>
                        <path fill-rule="evenodd" d="M5.854 4.146a.5.5 0 0 1 0 .708L3.707 7H11.5A4.5 4.5 0 0 1 16 11.5a.5.5 0 0 1-1 0 3.5 3.5 0 0 0-3.5-3.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"/>
                      </svg>
                      
                    </button>`;
                  }
                }

              }
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
  
          // Aquí puedes agregar la captura de eventos para los botones:
          $('#tablaUsuarios tbody').off('click').on('click', 'button.desactivar', (event) => {
            const id = $(event.currentTarget).data('id');
            this.desactivarUsuarioPorId(id);
          });
  
          $('#tablaUsuarios tbody').on('click', 'button.activar', (event) => {
            const id = $(event.currentTarget).data('id');
            this.activarUsuarioPorId(id);
          });
  
        } else {
          // Si ya está inicializada, actualizamos los datos
          this.dataTable.clear();
          this.dataTable.rows.add(this.usuarios);
          this.dataTable.draw();
        }
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }

  desactivarUsuarioPorId(id_usuario: number): void {
    this.usuarioService.deshabilitarUsuario(id_usuario).subscribe(() => this.cargarUsuarios());
  }
  
  activarUsuarioPorId(id_usuario: number): void {
    this.usuarioService.habilitarUsuario(id_usuario).subscribe(() => this.cargarUsuarios());
  }




}
