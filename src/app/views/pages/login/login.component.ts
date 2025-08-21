import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardGroupComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { UsuarioService } from '../../../service/usuario.service';
import { UsuarioSesionModel } from '../../../model/usuarioSesion.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, CardGroupComponent, CardComponent, CardBodyComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, NgStyle, FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
 
  usuarioSesion: UsuarioSesionModel = null!;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private userService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.loginService.getAuth().subscribe(auth =>{
      if(auth){
        this.router.navigate(['/']);
      }
    })
  }

  login(){
    this.loginService.login(this.email, this.password)
      .then( () => {

        this.loginService.getAuth().subscribe(auth => {
          if (auth) {
            console.log('Usuario autenticado:', auth.email);
            console.log('UID:', auth.uid);

            this.userService.userFirebase(auth.uid).subscribe({
              next: (res) => {
                if (res.success) {
                  this.usuarioSesion = res.data;
                  console.log("res data: ", res.data);
                  localStorage.setItem('usuarioSesion', JSON.stringify(this.usuarioSesion));
                  console.log('Usuario sesión:', this.usuarioSesion);
                } else {
                  console.error('Error al obtener el usuario desde el backend');
                }
              },
              error: (err) => {
                console.error('Error en la solicitud al backend:', err);
              }
            });

          }
        });

        this.router.navigate(['/']);
      })
      .catch(error =>{
        console.log("error: ", error);
      });
  }

  onSubmit(f: NgForm){
    this.email = f.value.email;
    this.password = f.value.password;
    this.login();
    //console.log(f.value);
  }

  recuperar(){
    this.router.navigate(['/forgotPassword']);
  }

}
