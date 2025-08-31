import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, viewChild } from '@angular/core';
import { getStyle } from '@coreui/utils';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  ColComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  RowComponent,
  TemplateIdDirective,
  WidgetStatAComponent
} from '@coreui/angular';

import { DashService } from '../../../service/dash.service';
@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  imports: [RowComponent, ColComponent]
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  private changeDetectorRef = inject(ChangeDetectorRef);

  resumen: any = {
    total_usuarios: 0,
    total_auditores: 0,
    total_empresas_activas: 0,
    total_marcos_legales: 0
  };
  

  ngOnInit(): void {
    this.dashService.obtenerResumen().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.resumen = res.data;
        }
      },
      error: (err) => {
        console.error('Error al cargar resumen:', err);
      }
    });
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();

  }

  constructor(private dashService: DashService) {}



}
