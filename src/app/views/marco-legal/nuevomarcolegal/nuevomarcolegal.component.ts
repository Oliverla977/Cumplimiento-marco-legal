import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardImgDirective,
  CardTextDirective,
  CardTitleDirective,
  CardHeaderComponent,
  RowComponent,
  ColComponent,
  FormLabelDirective,
  FormCheckComponent
} from '@coreui/angular';
import { ToastBodyComponent, ToastComponent, ToastHeaderComponent, ToasterComponent } from '@coreui/angular';


import { MarcolegalService } from '../../../service/marcolegal.service';

@Component({
  selector: 'app-nuevomarcolegal',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent,
    ToasterComponent
  ],
  templateUrl: './nuevomarcolegal.component.html',
  styleUrl: './nuevomarcolegal.component.scss'
})
export class NuevomarcolegalComponent implements OnInit {

    marcoForm!: FormGroup;
    showToast = false;
    MensajeToast: string = '';

  
    constructor(private fb: FormBuilder, private marcoService: MarcolegalService) { }
  
    ngOnInit(): void {
      this.marcoForm = this.fb.group({
        nombre: ['', Validators.required],
        pais_origen: ['', Validators.required],
        descripcion: [''],
        titulos: this.fb.array([])
      });
    }
  
    // Getter para títulos
    get titulos(): FormArray {
      return this.marcoForm.get('titulos') as FormArray;
    }
  
    // Agregar título
    agregarTitulo() {
      const titulo = this.fb.group({
        nombre: ['', Validators.required],
        capitulos: this.fb.array([])
      });
      this.titulos.push(titulo);
    }
  
    // Getter de capítulos de un título
    capitulos(i: number): FormArray {
      return this.titulos.at(i).get('capitulos') as FormArray;
    }
  
    // Agregar capítulo a un título
    agregarCapitulo(i: number) {
      const capitulo = this.fb.group({
        nombre: ['', Validators.required],
        articulos: this.fb.array([])
      });
      this.capitulos(i).push(capitulo);
    }
  
    // Getter de artículos de un capítulo
    articulos(i: number, j: number): FormArray {
      return this.capitulos(i).at(j).get('articulos') as FormArray;
    }
  
    // Agregar artículo a un capítulo
    agregarArticulo(i: number, j: number) {
      const articulo = this.fb.group({
        numero: ['', Validators.required],
        nombre: ['', Validators.required],
        descripcion: [''],
        aplicable: [true]
      });
      this.articulos(i, j).push(articulo);
    }
  
    // Enviar todo
    enviar() {
      //validar formulario
      if (this.marcoForm.invalid) {
        console.error('Formulario inválido');
        this.MensajeToast = '❌ Por favor, complete todos los campos requeridos';
        this.showToast = true;
        setTimeout(() => (this.showToast = false), 3000);
        return;
      }
      console.log(this.marcoForm.value);
      // servicio para enviar a la API

      this.marcoService.registrarMarcoLegal(this.marcoForm.value).subscribe({
      next: (res) => {
        console.log('Registrado correctamente:', res);
        //limpiar el formulario
        this.marcoForm.reset();
        this.titulos.clear(); 
        this.MensajeToast = '✅ Registro guardado correctamente';
        this.showToast = true;
        setTimeout(() => (this.showToast = false), 3000);

      },
      error: (err) => {
        console.error('Error al registrar:', err);
      }
    });

    }

    
}
