import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../service/login.service';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [
    ReactiveFormsModule,
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective
  ]
})
export class RegisterComponent {

  resetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]]
    });
  }

  async reestablecerPassword() {
    const { email, confirmEmail } = this.resetForm.value;

    if (email !== confirmEmail) {
      alert('Los correos no coinciden');
      return;
    }

    try {
      await this.loginService.resetPassword(email);
      alert('Correo de recuperación enviado. Revisa tu bandeja.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error(error);
      alert('Error al enviar el correo: ' + (error.message || 'Intenta de nuevo'));
    }
  }
}
