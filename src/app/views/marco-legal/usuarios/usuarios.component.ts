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

 async actualizarUsuario(): Promise<void> {
      if (this.formUsuario.valid && this.usuarioEditandoId !== null) {
        const datosActualizados = {
          id_usuario: this.usuarioEditandoId,
          nombre: this.formUsuario.value.nombre,
          correo: this.formUsuario.get('correo')?.value,
          id_rol: this.formUsuario.value.rol
        };

    
        console.log('Actualizar usuario:', datosActualizados);
    
        try {
          // Si el usuario no está verificado, actualizar correo en Firebase
          const usuarioActual = await this.usuarioService.obtenerUsuario(this.usuarioEditandoId).toPromise();
          if (usuarioActual.data.verificado === 0 && usuarioActual.data.correo !== datosActualizados.correo) {
            await this.loginService.updateEmailFirebase(datosActualizados.correo);
            console.log('Correo actualizado en Firebase con contraseña por defecto');
          }
    
          // Actualizar también en MySQL
          this.usuarioService.actualizarUsuario(datosActualizados).subscribe({
            next: (res) => {
              console.log('Usuario actualizado en MySQL:', res);
              this.cerrarModal();
              this.cargarUsuarios();
            },
            error: (err) => console.error('Error al actualizar en MySQL:', err)
          });
    
        } catch (error: any) {
          console.error(error.message);
          alert(error.message);
        }
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
                    const estado = data.estado === 'Activo' ? 'desactivar' : 'activar';
                    const colorBtn = data.estado === 'Activo' ? 'danger' : 'success';
                    const titleBtn = data.estado === 'Activo' ? 'Deshabilitar Usuario' : 'Habilitar Usuario';
                    return `
                            <button class="btn btn-outline-warning btn-sm editar-usuario" data-id="${data.id_usuario}" title="Editar Usuario">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/>
                                </svg>
                            </button>
      
                            <button class="btn btn-outline-${colorBtn} btn-sm ${estado}-usuario" data-id="${data.id_usuario}" title="${titleBtn}">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
                                  <path d="m482-200 114-113-114-113-42 42 43 43q-28 1-54.5-9T381-381q-20-20-30.5-46T340-479q0-17 4.5-34t12.5-33l-44-44q-17 25-25 53t-8 57q0 38 15 75t44 66q29 29 65 43.5t74 15.5l-38 38 42 42Zm165-170q17-25 25-53t8-57q0-38-14.5-75.5T622-622q-29-29-65.5-43T482-679l38-39-42-42-114 113 114 113 42-42-44-44q27 0 55 10.5t48 30.5q20 20 30.5 46t10.5 52q0 17-4.5 34T603-414l44 44ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                                </svg>
                            </button>
                            `;
                  
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
  
          $('#tablaUsuarios tbody').off('click'); // quitar todos los handlers anteriores

          $('#tablaUsuarios tbody').on('click', 'button.editar-usuario', (event) => {
            //console.log('Botón de editar usuario clickeado');
          const id = $(event.currentTarget).data('id');
          const usuario = this.usuarios.find(u => u.id_usuario === id);
          if (usuario) {
            this.editando = true;
            this.usuarioEditandoId = usuario.id_usuario;
            this.modalVisible = true;

            console.log('Editar usuario ID edit:', usuario.id_usuario);
            this.editarUsuarioPorId(usuario.id_usuario);
        
            this.formUsuario.setValue({
              nombre: usuario.nombre,
              correo: usuario.correo,
              rol: usuario.id_rol
            });
          }
        });
        
        $('#tablaUsuarios tbody').on('click', 'button.desactivar-usuario', (event) => {
          const id = $(event.currentTarget).data('id');
          this.desactivarUsuarioPorId(id);
          //console.log('Usuario desactivado con ID:', id);
        });
        
        $('#tablaUsuarios tbody').on('click', 'button.activar-usuario', (event) => {
          const id = $(event.currentTarget).data('id');
          this.activarUsuarioPorId(id);
          //console.log('Usuario activado con ID:', id);
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
    //console.log('Usuario desactivado con ID:', id_usuario);
  }
  
  activarUsuarioPorId(id_usuario: number): void {
    this.usuarioService.habilitarUsuario(id_usuario).subscribe(() => this.cargarUsuarios());
    //console.log('Usuario activado con ID:', id_usuario);
  }


  editarUsuarioPorId(id_usuario: number): void {
      this.usuarioService.obtenerUsuario(id_usuario).subscribe({
        next: (res) => {
          const usuario = res.data[0];
          console.log('Usuario a editar cc:', usuario);
          console.log('usuario verificado:', usuario.verificado);
    
          this.editando = true;
          this.usuarioEditandoId = id_usuario;
          this.modalVisible = true;
    
          // Si ya fue verificado, deshabilitar input de correo
          const correoDisabled = usuario.verificado === 1;
    
          this.formUsuario = this.fb.group({
            nombre: [usuario.nombre, Validators.required],
            correo: [{ value: usuario.correo, disabled: correoDisabled }, [Validators.required, Validators.email]],
            rol: [usuario.id_rol, Validators.required]
          });
          console.log('entro en validacion de correo:' + correoDisabled);
        },
        error: (err) => console.error('Error al obtener usuario:', err)
      });
    }
    



}
