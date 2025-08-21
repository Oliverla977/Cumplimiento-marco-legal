import { Component, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarcolegalService } from '../../../service/marcolegal.service';
import { ReactiveFormsModule, FormsModule, AbstractControl } from '@angular/forms';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertComponent, ButtonDirective, ButtonGroupComponent, FormCheckLabelDirective, FormControlDirective, FormLabelDirective, ToastBodyComponent, ToastComponent, ToastHeaderComponent } from '@coreui/angular';
import { EvaluacionService } from '../../../service/evaluacion.service';

@Component({
  selector: 'app-evaluaciones',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    FormLabelDirective,
    FormControlDirective,
    ButtonDirective,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    AlertComponent,
    ToastComponent,
    ToastHeaderComponent,
    ToastBodyComponent

  ],
  templateUrl: './evaluaciones.component.html',
  styleUrl: './evaluaciones.component.scss'
})
export class EvaluacionesComponent implements OnInit {

  marcoLegal: any;
  idEvaluacion: number = 0;
  marcoLegalId: number = 0;
  evaluacionForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private marcoService: MarcolegalService,
    private evaluacionService: EvaluacionService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.evaluacionForm = this.fb.group({
      articulos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.idEvaluacion = Number(this.route.snapshot.paramMap.get('id'));
    this.marcoLegalId = Number(this.route.snapshot.paramMap.get('marcoLegalId'));
  
    //console.log('ID evaluación:', this.idEvaluacion);
    //console.log('Marco Legal ID:', this.marcoLegalId);
    this.cargarMarcosLegales();
  }



    cargarMarcosLegales(): void {
      this.marcoService.getMarcosLegalesporID(this.marcoLegalId).subscribe({
        next: (resp) => {
          if (resp.success) {
            this.marcoLegal = resp.data;
    
            // limpiamos por si acaso
            this.articulosFormArray.clear();
    
            // recorrer todos los títulos -> capítulos -> artículos
            this.marcoLegal.titulos.forEach((titulo: any) => {
              titulo.capitulos.forEach((capitulo: any) => {
                capitulo.articulos.forEach((articulo: any) => {
                  const disabled = articulo.aplicable === 0;
    
                  const articuloForm = this.fb.group({
                    id_articulo: [articulo.id_articulo],
                    descripcion: [articulo.descripcion],
                    cumplimiento: [{ value: disabled ? 4 : null, disabled: disabled }], // radiobutton
                    observacion: [{ value: '', disabled: disabled }],
                    //evidencia: [{ value: null, disabled: disabled }] // archivo
                  });
    
                  this.articulosFormArray.push(articuloForm);
                });
              });
            });
    
            console.log("Form array generado:", this.evaluacionForm.value);
          }
        },
        error: (err) => {
          console.error('Error cargando marco legal:', err);
        }
      });
    }
    
    get articulosFormArray(): FormArray {
      return this.evaluacionForm.get('articulos') as FormArray;
    }


    onFileChange(event: any, index: number) {
      const file = event.target.files[0];
      if (file) {
        this.articulosFormArray.at(index).get('evidencia')?.setValue(file);
      }
    }

    asFormGroup(control: AbstractControl): FormGroup {
      return control as FormGroup;
    }
    

    finalizarEvaluacion(): void {
      const resultado: any[] = [];
    
      this.articulosFormArray.controls.forEach((ctrl) => {
        const val = ctrl.getRawValue();
        resultado.push({
          id_evaluacion: this.idEvaluacion,
          id_articulo: val.id_articulo,
          id_estado: val.cumplimiento,
          observaciones: val.observacion,
          //evidencia: val.evidencia ? val.evidencia.name : null
        });
      });
    
      console.log("JSON final para enviar:", resultado);

      this.evaluacionService.guardarEvaluaciones(resultado).subscribe({
        next: (res) => {
          console.log('Guardado:', res)
          alert("Evaluación registrada");
          this.router.navigate(['/empresas']);
        },
        error: (err) => {
          console.error('Error:', err)
        }
      });

    }

    getArticuloIndex(idTitulo: number, idCapitulo: number, idArticulo: number): number {
      let index = 0;
    
      for (const t of this.marcoLegal.titulos) {
        for (const c of t.capitulos) {
          for (const a of c.articulos) {
            if (t.id_titulo === idTitulo && c.id_capitulo === idCapitulo && a.id_articulo === idArticulo) {
              return index;
            }
            index++;
          }
        }
      }
      return -1; // no encontrado
    }
    
    
  

}
