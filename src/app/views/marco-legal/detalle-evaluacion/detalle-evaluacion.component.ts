import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluacionService } from '../../../service/evaluacion.service';
import {
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  TemplateIdDirective
} from '@coreui/angular';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardImgDirective,
  CardTextDirective,
  CardTitleDirective,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  ContainerComponent
} from '@coreui/angular';
import { CommonModule } from '@angular/common';

import { type ChartData } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';

import { descargarInformeEvaluacion  } from '../../../service/pdf.gnerator';
import jsPDF from 'jspdf';

interface ResumenEvaluacion {
  id_evaluacion: number;
  empresa: string;
  marco_legal: string;
  usuario_auditor: string;
  cantidad_cumple: string;
  cantidad_no_cumple: string;
  cantidad_cumple_parcial: string;
  cantidad_no_aplica: string;
  porcentaje_cumple: string;
  porcentaje_no_cumple: string;
  porcentaje_cumple_parcial: string;
  porcentaje_no_aplica: string;
  porcentaje_cumplimiento: string;
}

interface ArticuloEvaluacion {
  id_marco_legal: number;
  marco_legal: string;
  descripcion_marco: string;
  pais_origen: string;
  id_titulo: number;
  titulo: string;
  id_capitulo: number;
  capitulo: string;
  id_articulo: number;
  numero_articulo: string;
  nombre_articulo: string;
  descripcion_articulo: string;
  aplicable: number;
  id_estado: number;
  estado: string;
  descripcion_estado: string;
  observaciones: string;
  evidencia: string | null;
}

interface InformeAgrupado {
  [marcoLegalId: number]: {
    marco_legal: string;
    descripcion_marco: string;
    pais_origen: string;
    titulos: {
      [tituloId: number]: {
        titulo: string;
        capitulos: {
          [capituloId: number]: {
            capitulo: string;
            articulos: ArticuloEvaluacion[];
          };
        };
      };
    };
  };
}

@Component({
  selector: 'app-detalle-evaluacion',
  imports: [
    CommonModule,
    CardComponent, 
    CardBodyComponent, 
    CardHeaderComponent,
    ColComponent,
    RowComponent,
    ContainerComponent,
    ChartjsComponent
  ],
  templateUrl: './detalle-evaluacion.component.html',
  styleUrl: './detalle-evaluacion.component.scss'
})
export class DetalleEvaluacionComponent implements OnInit {
  idEvaluacion: number = 0;
  informe: ArticuloEvaluacion[] = [];
  informeAgrupado: InformeAgrupado = {};

  resumen: any = null;
  empresa: string = '';
  auditor: string = '';
  nivelCumplimiento: string = '0';

  constructor(
    private route: ActivatedRoute,
    private evaluacionService: EvaluacionService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.idEvaluacion = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ID evaluación:', this.idEvaluacion);
    this.obtenerInforme();
    this.obtenerResumenGrafica();
  }

  obtenerResumenGrafica(): void {
    this.evaluacionService.obtenerResumenEvaluacion(this.idEvaluacion).subscribe({
      next: (res) => {
        if (res.success) {
          this.resumen = res.data[0];
          console.log("Datos de resumen recibidos:", res);
          console.log("Resumen de evaluación:", this.resumen);
          this.empresa = this.resumen.empresa;
          this.auditor = this.resumen.usuario_auditor;
          this.nivelCumplimiento = this.resumen.porcentaje_cumplimiento;
          console.log("Empresa:", this.empresa, "Auditor:", this.auditor);
          // Actualizar datos para la gráfica
          // ⚡ Convertir strings a números
            const cumple = parseFloat(this.resumen.porcentaje_cumple);
            const noCumple = parseFloat(this.resumen.porcentaje_no_cumple);
            const parcial = parseFloat(this.resumen.porcentaje_cumple_parcial);
            const noAplica = parseFloat(this.resumen.porcentaje_no_aplica);
    
            // Asignar a la gráfica
            this.data = {
              labels: ['Cumple', 'No Cumple', 'Cumple Parcialmente', 'No Aplica'],
              datasets: [
                {
                  backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#6c757d'],
                  data: [cumple, noCumple, parcial, noAplica]
                }
              ]
            };
    
            console.log("Datos para gráfica:", this.data);
            
        }
    },
      error: (err) => {
        console.error("Error al obtener resumen:", err);
      }
    });
  }

  obtenerInforme(): void {
    this.evaluacionService.obtenerInformeEvaluacion(this.idEvaluacion).subscribe({
      next: (res) => {
        if (res.success) {
          this.informe = res.data;
          this.agruparInforme();
          console.log("id recibida: ", this.idEvaluacion);
          console.log("Informe de evaluación:", res.data);
          console.log("Informe agrupado:", this.informeAgrupado);
        }
      },
      error: (err) => {
        console.error("Error al obtener informe:", err);
      }
    });
  }

  agruparInforme(): void {
    this.informeAgrupado = {};
    
    this.informe.forEach(articulo => {
      // Crear estructura del marco legal si no existe
      if (!this.informeAgrupado[articulo.id_marco_legal]) {
        this.informeAgrupado[articulo.id_marco_legal] = {
          marco_legal: articulo.marco_legal,
          descripcion_marco: articulo.descripcion_marco,
          pais_origen: articulo.pais_origen,
          titulos: {}
        };
      }

      // Crear estructura del título si no existe
      if (!this.informeAgrupado[articulo.id_marco_legal].titulos[articulo.id_titulo]) {
        this.informeAgrupado[articulo.id_marco_legal].titulos[articulo.id_titulo] = {
          titulo: articulo.titulo,
          capitulos: {}
        };
      }

      // Crear estructura del capítulo si no existe
      if (!this.informeAgrupado[articulo.id_marco_legal].titulos[articulo.id_titulo].capitulos[articulo.id_capitulo]) {
        this.informeAgrupado[articulo.id_marco_legal].titulos[articulo.id_titulo].capitulos[articulo.id_capitulo] = {
          capitulo: articulo.capitulo,
          articulos: []
        };
      }

      // Agregar el artículo al capítulo correspondiente
      this.informeAgrupado[articulo.id_marco_legal].titulos[articulo.id_titulo].capitulos[articulo.id_capitulo].articulos.push(articulo);
    });
  }

  // Obtener las claves de los objetos para usar en *ngFor
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  // Función para determinar la clase CSS basada en el estado
  getEstadoClass(idEstado: number): string {
    switch(idEstado) {
      case 1: return 'text-success'; // Cumple
      case 2: return 'text-danger'; // No Cumple parcialmente
      case 3: return 'text-warning';  // Cumple parcialmente
      case 4: return 'text-muted';   // N/A
      default: return 'text-secondary';
    }
  }

  // Función para obtener el ícono basado en el estado
  getEstadoIcon(idEstado: number): string {
    switch(idEstado) {
      case 1: return 'cil-check-circle';
      case 2: return 'cil-warning';
      case 3: return 'cil-x-circle';
      case 4: return 'cil-minus';
      default: return 'cil-help';
    }
  }

  // Función para determinar si la evidencia es una imagen
  esImagen(evidencia: string): boolean {
    if (!evidencia) return false;
    const extensionesImagen = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return extensionesImagen.some(ext => evidencia.toLowerCase().includes(ext));
  }

  // Función para determinar si la evidencia es un PDF
  esPDF(evidencia: string): boolean {
    if (!evidencia) return false;
    return evidencia.toLowerCase().includes('.pdf');
  }

  // Función para determinar si la evidencia es un video
  esVideo(evidencia: string): boolean {
    if (!evidencia) return false;
    const extensionesVideo = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
    return extensionesVideo.some(ext => evidencia.toLowerCase().includes(ext));
  }

  // Función para abrir evidencia en nueva ventana
  abrirEvidencia(evidencia: string): void {
    if (evidencia) {
      window.open(evidencia, '_blank');
    }
  }

  // Datos para la gráfica
  data: ChartData<'doughnut'> = {
    labels: ['Cumple', 'No Cumple', 'Cumple Parcialmente', 'No Aplica'],
    datasets: [
      {
        backgroundColor: ['#28a745', '#dc3545', '#ffc107', '#6c757d'], 
        data: [] // lo llenaremos después
      }
    ]
  };

  //informe

  generarInformePDF(): void {
    descargarInformeEvaluacion(this.resumen);
  }
  

}