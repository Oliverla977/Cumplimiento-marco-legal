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


  constructor(
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private rolService: RolService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(data => {
      this.usuarios = data;
    });

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
    setTimeout(() => {
      if (!this.dataTableInitialized) {
        ($('#tablaUsuarios') as any).DataTable({
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
      // llamar a un método de UsuarioService para agregarlo
      this.loginService.registrarse(nuevoUsuario.correo, 'Umg2025*').then(() => {
        console.log('Usuario registrado exitosamente');
        //guardar el usuario en la base de datos

      });
      this.cerrarModal();
    }
  }

  editarUsuario(usuario: any): void {
  this.editando = true;
  this.usuarioEditandoId = usuario.id_usuario;
  this.modalVisible = true;

  this.formUsuario.setValue({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.id_rol
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
    usuario.estado = 'Inactivo';
    console.log('Usuario desactivado:', usuario);
  }

  activarUsuario(usuario: UsuarioModel): void {
    usuario.estado = 'Activo';
    console.log('Usuario activado:', usuario);
  }



}
