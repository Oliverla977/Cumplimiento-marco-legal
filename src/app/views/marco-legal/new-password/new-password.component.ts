import { Component, inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../../../service/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IconDirective, IconSetService } from '@coreui/icons-angular';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent,
  SpinnerComponent
} from '@coreui/angular';

import { cilCheckCircle, cilX, cilLoopCircular } from '@coreui/icons';

@Component({
  selector: 'app-new-password',
  imports: [
    ContainerComponent, 
    RowComponent, 
    ColComponent, 
    CardComponent, 
    CardBodyComponent, 
    InputGroupComponent, 
    InputGroupTextDirective, 
    IconDirective, 
    FormControlDirective, 
    ButtonDirective,
    AlertComponent,
    SpinnerComponent,
    FormsModule, 
    CommonModule
  ],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.scss'
})
export class NewPasswordComponent implements OnInit {

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  readonly #iconSetService = inject(IconSetService);

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.#iconSetService.icons = {
      ...this.#iconSetService.icons,
      cilCheckCircle,
      cilX,
      cilLoopCircular
    };
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch(field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  validateForm(): { valid: boolean; message: string } {
    if (!this.currentPassword) {
      return { valid: false, message: 'La contraseña actual es requerida' };
    }

    if (!this.newPassword) {
      return { valid: false, message: 'La nueva contraseña es requerida' };
    }

    if (!this.confirmPassword) {
      return { valid: false, message: 'Confirma la nueva contraseña' };
    }

    if (this.newPassword !== this.confirmPassword) {
      return { valid: false, message: 'Las nuevas contraseñas no coinciden' };
    }

    if (this.currentPassword === this.newPassword) {
      return { valid: false, message: 'La nueva contraseña debe ser diferente a la actual' };
    }

    // Validar fortaleza de la contraseña
    const strengthCheck = this.loginService.validatePasswordStrength(this.newPassword);
    if (!strengthCheck.valid) {
      return { valid: false, message: strengthCheck.message };
    }

    return { valid: true, message: '' };
  }

  async onSubmit(form: NgForm) {
    this.errorMessage = '';
    this.successMessage = '';

    if (!form.valid) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    const validation = this.validateForm();
    if (!validation.valid) {
      this.errorMessage = validation.message;
      return;
    }

    this.loading = true;

    try {
      await this.loginService.changePassword(this.currentPassword, this.newPassword);
      this.successMessage = 'Contraseña cambiada exitosamente';
      
      // Limpiar formulario
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      
      // Opcional: redirigir después de unos segundos
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);

    } catch (error: any) {
      this.errorMessage = error.message || 'Error al cambiar la contraseña';
    } finally {
      this.loading = false;
    }
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

}
