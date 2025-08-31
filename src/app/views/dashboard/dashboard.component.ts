import { Component, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import { DashService } from '../../service/dash.service';

import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonGroupComponent } from '@coreui/angular';
import { ProgressComponent } from '@coreui/angular';

import { ChartType } from 'chart.js';

import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';


import {
  CardFooterComponent,
  CardGroupComponent
} from '@coreui/angular';

import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardImgDirective,
  CardTextDirective,
  CardTitleDirective
} from '@coreui/angular';

import { ColComponent, ContainerComponent, GutterDirective, RowComponent } from '@coreui/angular';

import { type ChartData } from 'chart.js';
import { ChartjsComponent } from '@coreui/angular-chartjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.component.html',
    imports: [CardComponent, CardBodyComponent, ButtonDirective,
      RowComponent, ColComponent, CommonModule,
    ReactiveFormsModule, ButtonGroupComponent, ChartjsComponent, WidgetsDropdownComponent
    ],
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Control de radio (ULTIMAS / TODAS)
  trafficRadioGroup: FormGroup;
  modoSeleccionado: string = 'TODAS';

  // Datos de la API
  resumenData: any[] = [];

  // Configuración del gráfico
  mainChart: {
    type: ChartType;
    data: any;
    options: ChartOptions;
  } = {
    type: 'line',
    data: {
      labels: [],
      datasets: []
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  };

  constructor(private dashboardService: DashService) {
    this.trafficRadioGroup = new FormGroup({
      trafficRadio: new FormControl('TODAS')
    });
  }

  ngOnInit(): void {
    this.cargarDatos(this.modoSeleccionado);
  }

  setTrafficPeriod(modo: string) {
    this.modoSeleccionado = modo;
    this.cargarDatos(modo);
  }

  cargarDatos(modo: string) {
    this.dashboardService.obtenerResumenCumplimiento(modo).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.resumenData = resp.data;
          this.configurarGrafico();
        }
      },
      error: (err) => {
        console.error('Error al obtener resumen de cumplimiento:', err);
      }
    });
  }

  configurarGrafico() {
    const labels = this.resumenData.map(d => `${d.empresa} (${d.fecha})`);
    const cumple = this.resumenData.map(d => d.pct_cumple);
    const noCumple = this.resumenData.map(d => d.pct_no_cumple);
    const cumpleParcial = this.resumenData.map(d => d.pct_cumple_parcial);

    this.mainChart = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Cumple %',
            backgroundColor: 'rgba(40, 167, 69, 0.3)',
            borderColor: '#28a745',
            data: cumple,
            fill: true
          },
          {
            label: 'No Cumple %',
            backgroundColor: 'rgba(220, 53, 69, 0.3)',
            borderColor: '#dc3545',
            data: noCumple,
            fill: true
          },
          {
            label: 'Cumple Parcial %',
            backgroundColor: 'rgba(255, 193, 7, 0.3)',
            borderColor: '#ffc107',
            data: cumpleParcial,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'bottom' }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: { stepSize: 20 }
          }
        }
      }
    };
  }
get promedioCumple(): number {
  const data = this.resumenData ?? []; // si es undefined, usar array vacío
  return data.length
    ? data.reduce((a, b) => a + (b.pct_cumple ?? 0), 0) / data.length
    : 0;
}

get promedioNoCumple(): number {
  const data = this.resumenData ?? [];
  return data.length
    ? data.reduce((a, b) => a + (b.pct_no_cumple ?? 0), 0) / data.length
    : 0;
}

get promedioCumpleParcial(): number {
  const data = this.resumenData ?? [];
  return data.length
    ? data.reduce((a, b) => a + (b.pct_cumple_parcial ?? 0), 0) / data.length
    : 0;
}



}
